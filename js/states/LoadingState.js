// The loading state is responsible for loading all the necessary assets.
// It will read the assets from the JSON file and load them.
// The preload method loads teh correct phaser asset according to type.
// At the end it will call the next state.

var RPG = RPG || {};

RPG.LoadingState = function () {
	"use strict";
	Phaser.State.call(this);
};

RPG.LoadingState.prototype = Object.create(Phaser.State.prototype);
RPG.LoadingState.prototype.constructor = RPG.LoadingState;

RPG.LoadingState.prototype.init = function (level_data, next_state, extra_parameters) {
	"use strict";
	this.level_data = level_data;
	this.next_state = next_state;
	this.extra_parameters = extra_parameters;
};

// load assets according to asset key

RPG.LoadingState.prototype.preload = function () {
	"use strict";
	var assets, asset_loader, asset_key, asset;
	assets = this.level_data.assets;
	// Loads assets according to asset key
	for (asset_key in assets) {
		if (assets.hasOwnProperty(asset_key)) {
			asset = assets[asset_key];
			switch (asset.type) {
			case "image":
				this.load.image(asset_key, asset.source);
				break;
			case "spritesheet":
				this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
				break;
			case "tilemap":
				this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
				break;
			}
		}
	}
};

RPG.LoadingState.prototype.create = function () {
	"use strict";
	this.game.state.start(this.next_state, true, false, this.level_data, this.extra_parameters);
};