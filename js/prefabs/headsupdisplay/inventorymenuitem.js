// The inventory menu item prefab must disable and hide the actions menu, whilse showing and enabling the items menu.

var RPG = RPG || {};

RPG.InventoryMenuItem = function (game_state, name, position, properties) {
	"use strict";
	RPG.MenuItem.call(this, game_state, name, position, properties);
};

RPG.InventoryMenuItem.prototype = Object.create(RPG.MenuItem.prototype);
RPG.InventoryMenuItem.prototype.constructor = RPG.InventoryMenuItem;

RPG.InventoryMenuItem.prototype.select = function () {
	"use stict";

	// Select only if there are remaing items
	if (this.game_state.prefabs.inventory.items.length > 0) {

		// Disable the actions menu
		this.game_state.prefabs.actions_menu.disable();
		this.game_state.prefabs.actions_menu.hide();

		// Enable enemy units menu so the player can choose a target
		this.game_state.prefabs.items_menu.show();
		this.game_state.prefabs.items_menu.enable();
	}
};