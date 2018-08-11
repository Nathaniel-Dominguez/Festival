// This is the generic item prefab. All items extend this.
var RPG = RPG || {};

RPG.Item = function (game_state, name, position, properties) {
	"use strict";
	RPG.Prefab.call(this, game_state, name, position, properties);
};

RPG.Item.prototype = Object.create(RPG.Prefab.prototype);
RPG.Item.prototype.constructor = RPG.Item;

// The use method will destory the item
RPG.Item.prototype.use = function () {
	"use strict";

	// By default the item is destroyed
	this.kill();
};