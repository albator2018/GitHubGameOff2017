var Menu = {};
var spaceKey;

Menu.preload = function(){
  game.load.image('spacebar', 'assets/buttons/spacebar.png');
}

Menu.create = function(){
  spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  var sBar = game.add.sprite(320, 240, 'spacebar');
  sBar.anchor.setTo(0.5, 0.5);
}

Menu.update = function(){
  if (spaceKey.isDown){
    console.log("spacebar");
    game.state.start('Game');
  }
}
