// the itemmenuitem prefab is used to select items to use 
// To do this it must disable the items menu, enable the player units menu to select a player unit to 

var RPG = RPG || {};

RPG.ItemMenuItem = function (game_state, name, position, properties) {
	"use strict";
	RPG.MenuItem.call(this, game_state, name, position, properties);
};

RPG.ItemMenuItem.prototype = Object.create(RPG.MenuItem.prototype);
RPG.ItemMenuItem.prototype.constructor = RPG.ItemMenuItem;

RPG.ItemMenuItem.prototype.select = function () {
	"use strict";

	// Disables the action menu
	this.game_state.prefabs.items_menu.disable();

	// Enable the player units menu to choose a target for the item
	this.game_state.prefabs.player_units_menu.enable();

	// Save selected item
	this.game_state.current_item = this.text;
};