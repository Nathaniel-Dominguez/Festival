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

	// Creates my groups from json object file
	this.groups = {};
	this.level_data.groups.forEach(function (group_name) {
		this.groups[group_name] = this.game.add.group();
	}, this);

	// Creates my prefabs from json object file
	this.prefabs = {};
	for (prefab_name in this.level_data.prefabs) {
		if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {

			// Create prefab
			this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
		}
	}

	// Init hud creates units array with player and enemy units
	this.init_hud();

	this.units = [];
	this.units = this.units.concat(this.groups.player_units.children);
	this.units = this.units.concat(this.groups.enemy_units.children);
};

RPG.BattleState.prototype.create_prefab = function (prefab_name, prefab_data) {
	"use strict";
	var prefab;

	// create object according to its type
	if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
		prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_data.position, prefab_data.properties);
	}
};

// Init the hud to show player actions, units and enemy units
RPG.BattleState.prototype.init_hud = function () {
	"use strict";
	var unit_index, player_unit_health;

	this.show_player_actions({x: 106, y: 210});
	this.show_units("player_units", {x: 202, y: 210}, RPG.PlayerMenuItem.prototype.constructor);
	this.show_units("enemy_units", {x: 10, y: 210}, RPG.EnemyMenuItem.prototype.constructor);
};

RPG.BattleState.prototype.show_units = function (group_name, position, menu_item_constructor) {
	"use strict";
	var unit_index, menu_items, unit_menu_item, units_menu;

	// Creates the units menu items
	unit_index = 0;
	menu_items = [];

	this.groups[group_name].forEach(function (unit) {
		unit_menu_item = new menu_item_constructor(this, unit.name + "_menu_item", {x: position.x, y: position.y + unit_index * 20}, {group: "hud", text: unit.name, style: Object.create(this.TEXT_STYLE)});
		unit_index += 1;
		menu_items.push(unit_menu_item);
	}, this);

	// Creates the units menu
	units_menu = new RPG.Menu(this, group_name + "_menu", position, {group: "hud", menu_items: menu_items});
};

RPG.BattleState.prototype.show_player_actions = function (position) {
	"use strict";
	var actions, actions_menu_items, action_index, actions_menu;

	// Available actions
	actions = [{text: "Attack", item_constructor: RPG.AttackMenuItem.prototype.constructor}];
	actions_menu_items = [];
	action_index = 0;

	// Creates a menu item for each action 
	
	actions.forEach(function (action) {
		
		actions_menu_items.push(new action.item_constructor(this, action.text + "_menu_item", {x: position.x, y: position.y + action_index * 20}, {group: "hud", text: action.text, style: Object.create(this.TEXT_STYLE)}));
		
		action_index += 1;
	}, this);
	actions_menu = new RPG.Menu(this, "actions_menu", position, {group: "hud", menu_items: actions_menu_items});
	console.log
};

// For each prefab, the "create_prefab" method will instantiate the correct prefab-
// - according to it's type. Two things are required for this.
// 1 All prefabs must have the same constructor 
// 2 We must have a property mapping each prefab type to it's constructor.
// This property is defined in the BattleState constructor. 
// Since all units are declared in the JSON file, they now will appear ready in-
// in our battlestate.