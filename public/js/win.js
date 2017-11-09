var Win = {};

Win.create = function(){
  //you win
  youWin = game.add.sprite(320, 240, 'logo');
  youWin.anchor.setTo(0.5, 0.5);
  youWin.alpha = 0;
  youWin.fixedToCamera = true;
  var tween = game.add.tween(youWin).to( { alpha: 1 }, 2000, "Linear", true, 0, -1);
}
