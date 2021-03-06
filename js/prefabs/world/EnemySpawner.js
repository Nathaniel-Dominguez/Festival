// This is the EnemySpawner method used to check for possible encounters.

var RPG = RPG || {};

RPG.EnemySpawner = function (game_state, name, position, properties) {
	"use strict";
	RPG.Prefab.call(this, game_state, name, position, properties);

	this.game_state.game.physics.arcade.enable(this);
	this.body.immovable = true;

	this.overlapping = true;
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

    // Check for spawn only once for overlap
    if (!this.overlapping) {
        spawn_chance = this.game_state.game.rnd.frac();

        // Check if the enemy spawn probability is less than the generated random number for each spawn
        for (encounter_index = 0; encounter_index < this.game_state.level_data.enemy_encounters.length; encounter_index += 1) {
            enemy_encounter = this.game_state.level_data.enemy_encounters[encounter_index];
            if (spawn_chance <= enemy_encounter.probability) {

                // Save current player position for later
                this.game_state.player_position = this.game_state.prefabs.player.position;

                // Call the battle state
                this.game_state.game.state.start("BootState", false, false, "assets/levels/battle.json", "BattleState", {encounter: enemy_encounter, party_data: this.game_state.party_data, inventory: this.game_state.inventory});
                break;
            }
        }
    }
};