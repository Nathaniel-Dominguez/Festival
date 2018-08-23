// Player unit js prefab 

var RPG = RPG || {};

RPG.PlayerUnit = function (game_state, name, position, properties) {
	"use strict";
	RPG.Unit.call(this, game_state, name, position, properties);

	this.anchor.setTo(0.5);
};

RPG.PlayerUnit.prototype = Object.create(RPG.Unit.prototype);
RPG.PlayerUnit.prototype.constructor = RPG.PlayerUnit;

// Implementing the act method for PlayerUnit highlights the current player unit and 
// enables the enemy units menu, So the player can choose the enemy to attack.
RPG.PlayerUnit.prototype.act = function () {
	"use strict";
	var unit_index, player_units_menu_items;

	// search for the index of this unit in the player_units_menu
	unit_index = this.game_state.prefabs.player_units_menu.find_item_index(this.name);
	this.game_state.prefabs.player_units_menu.move_selection(unit_index);

	// enable menu for choosing the action
	this.game_state.prefabs.actions_menu.enable();
};

// death function for when player dies
// When a player unit dies it will change the alpha of the menu item making it darker.
RPG.PlayerUnit.prototype.kill = function () {
	"use strict";
	var menu_item_index, menu_item;
	Phaser.Sprite.prototype.kill.call(this);

	//remove from the menu on death
	menu_item_index = this.game_state.prefabs.player_units_menu.find_item_index(this.name);
	this.game_state.prefabs.player_units_menu.menu_items[menu_item_index].alpha = 0.5;
};

// The recieve experience method will increase the player units experience
// It will then check to see if the player reached the next level using the experience table
// Finally when that is done and a new level is reached the stats are increased and the unit XP is reset to 0
RPG.PlayerUnit.prototype.recieve_experience = function (experience) {
	"use strict";
	var next_level_data, stat;

	// Increase player unit XP
	this.stats.experience += experience;
	next_level_data = this.game_state.experience_table[this.stats.current_level];

	// If current XP is greater then the required amount for the next level, the unit levels up
	if (this.stats.experience >= next_level_data.required_exp) {
		this.stats.current_level += 1;
		this.stats.experience = 0;

		// Increase unit stats for the level gain
		for (stat in next_level_data.stats_increase) {
			if (next_level_data.stats_increase.hasOwnProperty(stat)) {
				this.stats[stat] += next_level_data.stats_increase[stat];
			}
		}
	}
};