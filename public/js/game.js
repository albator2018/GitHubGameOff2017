var Game = {};

var ThrowBack = {};
var player;
var idle, right, left, up, down;
var enemies;
var throwBackArray = [];
var tb = 0;
var tBack, yWin;
var button1, button2;
// Easystar is what we use for A* pathfinding
var easystar = new EasyStar.js();

Game.init = function(){
  game.stage.disableVisibilityChange = true;
};


Game.preload = function() {
  game.load.tilemap('map', 'assets/map/example_map_2.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
  //game.load.image('sprite','assets/sprites/sprite.png');
  game.load.spritesheet('sprite', 'assets/sprites/spritesheet.png', 48, 48);
  game.load.spritesheet('enemy', 'assets/sprites/spritesheet-enemy.png', 48, 48);
  game.load.image('home', 'assets/sprites/home.png');

  //game.load.spritesheet('button1', 'assets/sprites/throwback.png', 47, 45);
  //game.load.spritesheet('button2', 'assets/sprites/play.png', 47, 45);

  game.load.image('learn', 'assets/sprites/learn.png');
  game.load.image('logo', 'assets/sprites/phaser2.png');
};

Game.create = function(){
  Game.playerMap = {};
  var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  game.world.setBounds(0, 0, 1024, 768);

  var map = game.add.tilemap('map');
  map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
  var layer;
  for(var i = 0; i < map.layers.length; i++) {
      layer = map.createLayer(i);
  };

  layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
  layer.events.onInputUp.add(Game.getCoordinates, this);

  game.physics.startSystem(Phaser.Physics.ARCADE);

  Game.addPlayer(100, 100);
  idle = player.animations.add('idle', [0], 10, true);
  right = player.animations.add('right', [7, 8, 9, 10, 11, 12], 10, true);
  left = player.animations.add('left', [15, 16, 17, 18, 19, 20], 10, true);
  up = player.animations.add('up', [21, 22], 10, true);

  //  Here we create 2 new groups
  enemies = game.add.group();

  for (var i = 0; i < 10; i++)
  {
      //  This creates a new Phaser.Sprite instance within the group
      //  It will be randomly placed within the world and use the 'baddie' image to display
      Game.addEnemies(Math.random() * 1024, Math.random() * 768);
  };

  home = game.add.sprite(1024 - 217, 768 - 244, 'home');
  game.physics.arcade.enable(home);

  //throwback
  tBack = game.add.sprite(320, 240, 'learn');
  tBack.anchor.setTo(0.5, 0.5);
  tBack.alpha = 0;
  tBack.fixedToCamera = true;

};

Game.update = function(){
  game.physics.arcade.overlap(player, enemies, Game.collisionHandler, null, this);
  game.physics.arcade.overlap(player, home, Game.collisionHome, null, this);
};

Game.collisionHandler = function(){
  //game.add.tween(tBack).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  player.kill();
  Game.addPlayer(throwBackArray[tb-1][0].x*32,throwBackArray[tb-1][0].y*32);

};

Game.collisionHome = function(){
  game.state.start('Win');
}

Game.getCoordinates = function(layer, pointer){
  Game.movePlayer(pointer.worldX,pointer.worldY);
};

Game.addPlayer = function(x, y){
  player = game.add.sprite(x, y, 'sprite', 0);
  player.smoothed = false;
  game.physics.arcade.enable(player);

  game.camera.follow(player);
};

Game.addEnemies = function(x, y){
  enemy = game.add.sprite(x, y, 'enemy', 0);
  enemy.smoothed = false;
  game.physics.arcade.enable(enemy);
  enemies.add(enemy);
}

Game.movePlayer = function(x, y){
  var m = game.cache.getTilemapData('map').data.layers[0].data;

    var myGrid = new Array();
    for(i=0; i<31; i++){
      myGrid[i] = new Array();
      for(j=0; j<32; j++){
        myGrid[i].push(m[i*j]);
        console.log(myGrid[i][j]);
      }
    }

    easystar.setGrid(myGrid);
    easystar.setAcceptableTiles([11]);
/*
  console.log(Math.floor(player.x/32), Math.floor(player.y/32));
  console.log(Math.floor(x/32), Math.floor(y/32));
*/
    easystar.findPath(Math.floor(player.x/32), Math.floor(player.y/32), Math.floor(x/32), Math.floor(y/32), function( path ) {
    	if (path === null) {
    	 console.log("Path was not found.");
    	} else {
    	 console.log("Path was found.");

       throwBackArray.push(path);
       tb = tb + 1;

        if(this.ismoving === true){
          this.tween.stop();
        }
        i = 0,
        ilen = path.length;
        function moveObject( object ){
          if(path.length > 1){
            object.ismoving = true;
            var StepX = path[i].x || false, StepY = path[i].y || false;
            tween = game.add.tween( object ).to({ x: StepX*32, y: StepY*32}, 150).start();
            dx = path[i].x;
            tween.onComplete.add(function(){
              i++;
              if(i < ilen){
                console.log(path[i]);console.log(path[i+1]);
                if (path[i].x > dx) {
                  player.play('right');
                };
                if (path[i].x < dx) {
                  player.play('left');
                };
                if (path[i].x == dx) {
                  player.play('up');
                };
                moveObject( object );
              }else{
                player.play('idle');
                return false;
              }
            });
          }else{
            //@TODO add emoticon - no path (!)
            this.ismoving = false;
          }
        }
        moveObject(player);
    	}
    });

    easystar.calculate();

};
