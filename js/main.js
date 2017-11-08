// 768 (24x32) x 544 (17x32) should be 640 (20x32) x 480 (15x32) because of itch.io so this will be the camera
// now that the map is 32 x 24 => 1024 x 768
var game = new Phaser.Game(20*32, 15*32, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game',Game);
game.state.add('Win',Win);
game.state.start('Game');
