// this is my unit JS file that my player unit and enemy unit call their attributes from

var RPG = RPG || {};

RPG.Unit = function (game_state, name, position, properties) {
	"use strict";
	RPG.Prefab.call(this, game_state, name, position, properties);

	this.anchor.setTo(0.5);

	this.stats = Object.create(properties.stats);

	this.attacked_animation = this.game_state.game.add.tween(this);
	this.attacked_animation.to({tint: 0xFF0000}, 200);
	this.attacked_animation.onComplete.add(this.restore_tint, this);

	this.act_turn = 0;
};

RPG.Unit.prototype = Object.create(RPG.Prefab.prototype);
RPG.Unit.prototype.constructor = RPG.Unit;

// Recieve damage reduces the units health and checks to see if it is dead.
// It also starts the attacked animation which changes the prefab tin to red then back to normal
RPG.Unit.prototype.recieve_damage = function (damage) {
	"use strict";
	this.stats.health -= damage;
	this.attacked_animation.start();
	if (this.stats.health <= 0) {
		this.stats.health = 0;
		this.kill();
	}
};

RPG.Unit.prototype.restore_tint = function () {
	"use strict";
	this.tint = 0xFFFFFFF;
};

RPG.Unit.prototype.calculate_act_turn = function (current_turn) {
	"use strict";

	// Calculate the act turn based on the unit speed
	this.act_turn = current_turn + Math.ceil(100 / this.stats.speed);
};