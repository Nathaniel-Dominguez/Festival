var RPG = RPG || {};

RPG.create_prefab_from_pool = function (pool, prefab_constructor, game_state, prefab_name, prefab_position, prefab_properties) {
	"use strict";
	var prefab;

	// Grabs first dead prefab from the pool
	prefab = pool.getFirstDead();
	if (!prefab) {

		// If there is no dead prefab create one
		prefab = new prefab_constructor(game_state, prefab_name, prefab_position, prefab_properties);
	} else {

		// if there is a dead prefab, reset it in the new position
		prefab.reset(prefab_position.x, prefab_position.y);
	}
};