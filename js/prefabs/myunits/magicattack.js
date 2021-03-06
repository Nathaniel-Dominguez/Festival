// Magic attack has a mana cost, attack multiplier based on the magic attack stat and a higher attack multiplier compared to normal attack

var RPG = RPG || {};

RPG.MagicAttack = function (game_state, name, position, properties) {
	"use strict";
	RPG.Attack.call(this, game_state, name, position, properties);

	this.mana_cost = properties.mana_cost;
};

RPG.MagicAttack.prototype = Object.create(RPG.Attack.prototype);
RPG.MagicAttack.prototype.constructor = RPG.MagicAttack;

RPG.MagicAttack.prototype.hit = function (target) {
	"use strict";

	var damage, attack_multiplier, defense_multiplier, action_message_position, action_message_text, attack_message;

	// The attack multiplier for magic attacks is higher then normal attacks
	attack_multiplier = this.game_state.rnd.realInRange(0.9, 1.3);
	defense_multiplier = this.game_state.game.rnd.realInRange(0.8, 1.2);

	// Calculates the damage using the magic attack stat
	damage = Math.max(0, Math.round((attack_multiplier * this.owner.stats.magic_attack) - (defense_multiplier * target.stats.defense)));

	// Apply the damage
	target.recieve_damage(damage);

	// Reduce the unit that cast the magic attack's mana
	this.game_state.current_unit.stats.mana -= this.mana_cost;

	this.show_message(target, damage);
};