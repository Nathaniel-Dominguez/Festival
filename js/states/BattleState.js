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

RPG.BattleState.prototype.init = function (level_data, extra_parameters) {
	"use strict";
	this.level_data = level_data;
	this.enemy_data = extra_parameters.enemy_data;
	this.party_data = extra_parameters.party_data;

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

	// Creates the enemy units
	for (enemy_unit_name in this.enemy_data) {
		if (this.enemy_data.hasOwnProperty(enemy_unit_name)) {

			// Creates the enemy units
			this.create_prefab(enemy_unit_name, this.enemy_data[enemy_unit_name]);
		}
	}

	// Creates the player units
	for (player_unit_name in this.party_data) {
		if (this.party_data.hasOwnProperty(player_unit_name)) {

			// Creates the player units
			this.create_prefab(player_unit_name, this.party_data[player_unit_name]);
		}
	}

	// Init hud creates units array with player and enemy units
	this.init_hud();

	// Store units in a priority queue which compares the units act turn
	this.units = new PriorityQueue({comparator: function (unit_a, unit_b) {
		return unit_a.act_turn - unit_b.act_turn;
	}});
	this.groups.player_units.forEach(function (unit) {
		unit.calculate_act_turn(0);
		this.units.queue(unit);
	}, this);
	this.groups.enemy_units.forEach(function (unit) {
		unit.calculate_act_turn(0);
		this.units.queue(unit);
	}, this); 

	// The next_turn method takes the first unit in the array and if the unit is alive, it acts and is pushed to the end of the units array.
	// Otherwise it calls the next turn.
	this.next_turn();
};

RPG.BattleState.prototype.create_prefab = function (prefab_name, prefab_data) {
	"use strict";
	var prefab;

	// create object according to its type
	if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
		prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_data.position, Object.create(prefab_data.properties));
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
};

// The next turn method will check if there are remaing enemy and player units.
// If no then we will call the end battle method and switch back to the world state. It saves party data too
// If there are no remaing player units we will call the game over method
RPG.BattleState.prototype.next_turn = function () {
	"use strict";

	// If all the enemy units are dead, go back to world state
	if (this.groups.enemy_units.countLiving() === 0) {
		this.end_battle();
	}

	// If all the player units are dead restart the game
	if (this.groups.player_units.countLiving() === 0) {
		this.game_over();
	}

	// Takes the next unit
	this.current_unit = this.units.dequeue();

	// If the unit is alive, it acts, otherwise it goes to the next turn
	if (this.current_unit.alive) {
		this.current_unit.act();
		this.current_unit.calculate_act_turn(this.current_unit.act_turn);
		this.units.queue(this.current_unit);
	} else {
		this.next_turn();
	}
}; 

RPG.BattleState.prototype.game_over = function () {
	"use strict";

	// Go back to world state and resetart the player position
	this.game.state.start("BootState", true, false, "assets/levels/level1.json", "WorldState", {restart_position: true});
};

RPG.BattleState.prototype.end_battle = function () {
	"use strict";

	// Saves current party hp
	this.groups.player_units.forEach(function (player_unit) {
		this.party_data[player_unit.name].properties.stats = player_unit.stats;
	}, this);

	// Go back to the world state with current party data
	this.game.state.start("BootState", true, false, "assets/levels/level1.json", "WorldState", {party_data: this.party_data});
};

// For each prefab, the "create_prefab" method will instantiate the correct prefab-
// - according to it's type. Two things are required for this.
// 1 All prefabs must have the same constructor 
// 2 We must have a property mapping each prefab type to it's constructor.
// This property is defined in the BattleState constructor. 
// Since all units are declared in the JSON file, they now will appear ready in-
// in our battlestate.