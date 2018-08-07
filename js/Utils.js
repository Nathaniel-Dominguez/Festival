var RPG = RPG || {};

RPG.create_prefab_from_pool = function (pool, prefab_constructor, game_state, prefab_name, prefab_position, prefab_properties) {
	"use strict";
	var prefab;

	prefab = pool.getFirstDead();
	if (!prefab) {

		prefab = new prefab_constructor(game_state, prefab_name, prefab_position, prefab_properties);
	} else {

		prefab.reset(prefab_position.x, prefab_position.y);
	}
};