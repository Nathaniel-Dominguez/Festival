// The inventory prefab has a list of items and methods to collect and use them

var RPG = RPG || {};

// This is my list of items
RPG.Inventory = function (game_state, name, position, properties) {
	"use strict";
	RPG.Prefab.call(this, game_state, name, position, properties);

	this.item_classes = {
		"potion": RPG.Potion.prototype.constructor
	};

	this.items = [];
};

RPG.Inventory.prototype = Object.create(RPG.Prefab.prototype);
RPG.Inventory.prototype.constructor = RPG.Inventory;

RPG.Inventory.prototype.create_menu = function (position) {
	"use strict";
	var menu_items, item_index, item, menu_item, items_menu;

	// create units menu items
	item_index = 0;
	menu_items = [];
	for (item_index = 0; item_index < this.items.length; item_index += 1) {
		item = this.items[item_index];
		menu_item = new RPG.ItemMenuItem(this.game_state, item.name + "_menu_item", {x: position.x, y: position.y + item_index * 20}, {group: "hud", text: item.name, style: Object.create(this.game_state.TEXT_STYLE)});
		menu_items.push(menu_item);
	}

	// Create a units menu
	items_menu = new RPG.Menu(this.game_state, "items_menu", position, {group: "hud", menu_items: menu_items});
	items_menu.hide();
};

// The collect item method recieves an object with item type and properties
// then it instantiates the appropriate item prefab adding it to the list
RPG.Inventory.prototype.collect_item = function (item_object) {
	"use strict";
	var item;

	// Creates the item prefab
	item = new this.item_classes[item_object.type](this.game_state, item_object.type + this.items.length, {x: 0, y: 0}, item_object.properties);
	this.items.push(item);
};

// The use_item method consumes the item, removing it from the items array
RPG.Inventory.prototype.use_item = function (item_name, target) {
	"use strict";
	var item_index;

	// Remove the item from items list
	for (item_index = 0; item_index < this.items.length; item_index += 1) {
		if (this.items[item_index].name === item_name) {
			this.items[item_index].use(target);
			this.items.splice(item_index, 1);
			break;
		}
	}
};