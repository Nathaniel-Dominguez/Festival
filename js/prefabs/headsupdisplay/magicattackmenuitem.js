// The attack magic menu item can only be selected if the current unit has enough mana and creates a new prefab
// Right now all the units have the same mana cost but I can change that based on the amount of damage or class

var RPG = RPG || {};

RPG.MagicAttackMenuItem = function (game_state, name, position, properties) {
	"use strict";
	RPG.MenuItem.call(this, game_state, name, position, properties);

	this.MANA_COST = 10;
};

RPG.MagicAttackMenuItem.prototype = Object.create(RPG.MenuItem.prototype);
RPG.MagicAttackMenuItem.prototype.constructor = RPG.MagicAttackMenuItem;

RPG.MagicAttackMenuItem.prototype.select = function () {
	"use strict";

	// This makes it so the player can only use it if the current unit has enough mana
	if (this.game_state.current_unit.stats.mana >= this.MANA_COST) {

		// Disable the actions menu
		this.game_state.prefabs.actions_menu.disable();

		// Enable the enemy units menu so the player can choose the target for the magic attack
		this.game_state.prefabs.enemy_units_menu.enable();

		// Save the current attack
		this.game_state.current_attack = new RPG.MagicAttack(this.game_state, this.game_state.current_unit.name + "_attack", {x: 0, y: 0}, {group: "attacks", mana_cost: this.MANA_COST, owner_name: this.game_state.current_unit.name});
	}
};