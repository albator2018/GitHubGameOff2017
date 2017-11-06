// 768 (24x32) x 544 (17x32) should be 640 (20x32) x 480 (15x32) because of itch.io so this will be the camera
var game = new Phaser.Game(20*32, 15*32, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game',Game);
game.state.start('Game');
