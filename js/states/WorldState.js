// This is the worldstate, the init method initializes the physics engine and creates a map from the json file
// It also creates a party_data object that contains the stats of the player units.

var RPG = RPG || {};

RPG.WorldState = function () {
	"use strict";
	Phaser.State.call(this);

	this.prefab_classes = {
		"player": RPG.Player.prototype.constructor,
		"enemy_spawner": RPG.EnemySpawner.prototype.constructor
	};
};

RPG.WorldState.prototype = Object.create(Phaser.State.prototype);
RPG.WorldState.prototype.constructor = RPG.WorldState;


RPG.WorldState.prototype.init = function (level_data, extra_parameters) {	
	"use strict";
	var tileset_index;
	this.level_data = this.level_data || level_data;

	// Free phaser scaling tool
	// I mean it's scaled, perfectly balanced. but at what cost?
	// I had to use phaser. that was the cost
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;

	// Starts physics. mad scientist physicsist physics 
	// Gordon Freeman up in here with his applied physics degree
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 0;

	// Creates the map and set tileset
	this.map = this.game.add.tilemap(this.level_data.map.key);
	tileset_index = 0;
	this.map.tilesets.forEach(function (tileset) {
		this.map.addTilesetImage(tileset.name, this.level_data.map.tilesets[tileset_index]);
		tileset_index += 1;
	}, this);

	// If there is no party data in the parameters, initialize it with default values
	this.party_data = extra_parameters.party_data || {
		"fighter": {
			"type": "player_unit",
			"position": {"x": 250, "y": 50},
			"properties": {
				"texture": "male_fighter_spritesheet",
				"group": "player_units",
				"frame": 10,
				"stats": {
					"attack": 15,
					"magic_attack": 5,
					"defense": 5,
					"health": 100,
					"mana": 100,
					"speed": 15,
					"experience": 0,
					"current_level": 0
				}
			}
		},
		"mage": {
			"type": "player_unit",
			"position": {"x": 250, "y": 100},
			"properties": {
				"texture": "female_mage_spritesheet",
				"group": "player_units",
				"frame": 10,
				"stats": {
					"attack": 20,
					"magic_attack": 20,
					"defense": 2,
					"health": 100,
					"mana": 100,
					"speed": 10,
					"experience": 0,
					"current_level": 0
				}
			}
		}
	};

	this.inventory = extra_parameters.inventory;

	if (extra_parameters.restart_position) {
		this.player_position = undefined;
	}
};

// The create method initializes the map layers, game groups and prefabs.
// The last part of the create method resets the player position
RPG.WorldState.prototype.create = function () {
	"use strict";
	var group_name, object_layer, collision_tiles;

	// Create map layers
	this.layers = {};
	this.map.layers.forEach(function (layer) {
		this.layers[layer.name] = this.map.createLayer(layer.name);
		
		// Collision Layer
		if (layer.properties.collision) { 
			collision_tiles = [];
			layer.data.forEach(function (data_row) {
				// Find tiles used in the layer
				data_row.forEach(function (tile) {
					// Check if it is a valid tile index and if it is on the list
					if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
						collision_tiles.push(tile.index);
					}
				}, this);
			}, this);
			this.map.setCollision(collision_tiles, true, layer.name);
		}
	}, this);

	// Resize the world to be the size of the current layer
	this.layers[this.map.layer.name].resizeWorld();

	// Create the groups
	this.groups = {};
	this.level_data.groups.forEach(function (group_name) {
		this.groups[group_name] = this.game.add.group();
	}, this);

	this.prefabs = {};

	for (object_layer in this.map.objects) {
		if (this.map.objects.hasOwnProperty(object_layer)) {
			// Creates the layer objects
			this.map.objects[object_layer].forEach(this.create_object, this);
		}
	}

	// If we came from battlestate, move the player to the previous position
	if (this.player_position) {
		this.prefabs.player.reset(this.player_position.x, this.player_position.y);
	}
};

RPG.WorldState.prototype.create_object = function (object) {
	"use strict";
	var object_y, position, prefab;

	// Tiled coordinates start in the bottom left corner
	object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
	position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};

	// Create object according to its type
	if (this.prefab_classes.hasOwnProperty(object.type)) {
		prefab = new this.prefab_classes[object.type](this, object.name, position, object.properties);
	}
	this.prefabs[object.name] = prefab;
};