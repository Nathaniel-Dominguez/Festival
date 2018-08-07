// The MenuItem prefab implements selection over and out methods called by menu.js
// When a menuitem is over the selection it will change color
// Object create uses a copy of text_style from battlestate when creating each Text-Prefab

var RPG = RPG || {};

RPG.MenuItem = function (game_state, name, position, properties) {
	"use strict";
	RPG.TextPrefab.call(this, game_state, name, position, properties);
};

RPG.MenuItem.prototype = Object.create(RPG.TextPrefab.prototype);
RPG.MenuItem.prototype.constructor = RPG.MenuItem;

RPG.MenuItem.prototype.selection_over = function () {
	"use strict";
	this.fill = "#FFFF00";
};

RPG.MenuItem.prototype.selection_out = function () {
	"use strict";
	this.fill = "#FFFFFF";
};