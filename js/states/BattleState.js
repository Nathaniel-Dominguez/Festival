// This will create a battle state that will show the player party, enemy units and-
// - a menu for the player to choose who they want to attack. 
// For the sake of building on tutorial lessons I will initialy create the basic-
// - structure, showing the units without the menues. Also all the units will be-
// - read from the JSON file. Later I will change it to pass this data as a parameter-
// in the init method.

// The "init" method only saves the level data and sets the game scale.
// The "create" method starts by creating all the groups and then create the prefabs.
// (Groups and prefabs are read from the JSON file).

var RPG = RPG || {};

RPG.BattleState = function () {
	"use strict";
	Phaser.State.call(this);

	this.prefab_classes = {
		"background": RPG.TilePrefab.prototype.constructor,
		"rectangle": RPG.Prefab.prototype.constructor,
		"player_unit": RPG.PlayerUnit.prototype.constructor,
		"enemy_unit": RPG.EnemyUnit.prototype.constructor
	};

	this.TEXT_STYLE = {font: "14px Arial", fill: "#FFFFFF"};
};

RPG.BattleState.prototype = Object.create(Phaser.State.prototype);
RPG.BattleState.prototype.constructor = RPG.BattleState;

RPG.BattleState.prototype.init = function (level_data) {
	"use strict";
	this.level_data = level_data;

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
};

RPG.BattleState.prototype.create = function () {
	"use strict";
	var group_name, prefab_name, player_unit_name, enemy_unit_name;

	// Create groups
	this.groups = {};
	this.level_data.groups.forEach(function (group_name) {
		this.groups[group_name] = this.game.add.group();
	}, this);

	// Create prefabs
	this.prefabs = {};
	for (prefab_name in this.level_data.prefabs) {
		if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {

			// Create prefab
			this.create_prefab (prefab_name, this.level_data.prefabs[prefab_name]);
		}
	}
};

RPG.BattleState.prototype.create_prefab = function (prefab_name, prefab_data) {
	"use strict";
	var prefab;

	// create object according to its type
	if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
		prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_data.position, prefab_data.properties);
	}
};

// For each prefab, the "create_prefab" method will instantiate the correct prefab-
// - according to it's type. Two things are required for this.
// 1 All prefabs must have the same constructor 
// 2 We must have a property mapping each prefab type to it's constructor.
// This property is defined in the BattleState constructor. 
// Since all units are declared in the JSON file, they now will appear ready in-
// in our battlestate.