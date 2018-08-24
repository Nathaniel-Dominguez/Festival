// Calling the canvas and adding then starting my game states.

var RPG = RPG || {};

var game = new Phaser.Game(320, 320, Phaser.CANVAS);

game.state.add("bootstate", new RPG.BootState());
game.state.add("loadingstate", new RPG.LoadingState());
game.state.add("worldstate", new RPG.WorldState());
game.state.add("battlestate", new RPG.BattleState());
game.state.start("bootstate", true, false, "assets/levels/level1.json", "worldstate", {});