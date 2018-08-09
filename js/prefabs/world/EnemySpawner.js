// This is the EnemySpawner method used to check for possible encounters.
var RPG = RPG || {};

RPG.EnemySpawner = function (game_state, name, position, properties) {
	"use strict";
	RPG.Prefab.call(this, game_state, name, position, properties);

	this.game_state.game.physics.arcade.enable(this);
	this.body.immovable = true;
};

RPG.EnemySpawner.prototype = Object.create(RPG.Prefab.prototype);
RPG.EnemySpawner.prototype.constructor = RPG.EnemySpawner;

// The update method checks for overlaps with the player and calls check for spawn when it occurs
RPG.EnemySpawner.prototype.update = function () {
	"use strict"
	this.overlapping = this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.check_for_spawn, null, this);
};

// Check for spawn generates a random number using the Phaser random data generator and compares it with enemy encounters probablities
// It chooses the first probability that is higher then the generated number. For this to work I have to sort encounters in ascending order of probability/
RPG.EnemySpawner.prototype.check_for_spawn = function () {
	"use strict";
	var spawn_chance, encounter_index, enemy_encounter;

	// Checks for spawn only when overlapped
	if (!this.overlapping) {
		spawn_chance = this.game_state.game.rnd.frac();

		// Check if the enemy spawn probablilty is less then the random number for each spawn
		for (encounter_index = 0; encounter_index < this.game_state.level_data.enemy_encounters.length; encounter_index += 1) {
			enemy_encounter = this.game_state.level_data.enemy_encounters[encounter_index];
			if (spawn_chance <= enemy_encounter.probablilty) {

				// Saves current player position for later
				this.game_state.player_position = this.game_state.prefabs.player.position;

				// Call the battle state
				this.game_state.game.state.start("BootState", false, false, "assets/level/battle.json", "BattleState", {enemy_data: enemy_encounter.enemy_data, party_data: this.game_state.party_data});
				break;
			}
		}
	}
};