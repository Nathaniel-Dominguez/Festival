// Boot state js, this will only load the json file and call the loadingstate.
// The game object is the heart of the game using the constructor it handles- 
// -common functions and the boot process

var RPG = RPG || {};

// Strict mode is a feature brought in with es5 that allows you to place a program 
// or a function, in a "strict" operating context. This strict context prevents 
// certain actions from being taken and throws more exceptions.

RPG.BootState = function () {
	"use strict";
	Phaser.State.call(this);
};

RPG.BootState.prototype = Object.create(Phaser.State.prototype);
RPG.BootState.prototype.constructor = RPG.BootState;

RPG.BootState.prototype.init = function (level_file, next_state) {
	"use strict";
	this.level_file = level_file;
	this.next_state = next_state;
};

RPG.BootState.prototype.preload = function () {
	"use strict";
	this.load.text("level1", this.level_file);
};

RPG.BootState.prototype.create = function () {
	"use strict";
	var level_text, level_data;
	level_text = this.game.cache.getText("level1");
	level_data = JSON.parse(level_text);
	this.game.state.start("LoadingState", true, false, level_data, this.next_state);
};