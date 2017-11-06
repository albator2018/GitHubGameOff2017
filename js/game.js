var Game = {};
var player;
var idle, right, left, up, down;
// for web
var easystar = new EasyStar.js();

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};


Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map_2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    //game.load.image('sprite','assets/sprites/sprite.png');
    game.load.spritesheet('sprite', 'assets/sprites/spritesheet.png', 48, 48);
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
    }
    Game.addPlayer(100, 100);
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);

    idle = player.animations.add('idle', [0], 10, true);
    right = player.animations.add('right', [7, 8, 9, 10, 11, 12], 10, true);
    left = player.animations.add('left', [15, 16, 17, 18, 19, 20], 10, true);
    up = player.animations.add('up', [21, 22], 10, true);
};

Game.getCoordinates = function(layer, pointer){
    Game.movePlayer(pointer.worldX,pointer.worldY);
};

Game.addPlayer = function(x, y){
    player = game.add.sprite(x, y, 'sprite', 0);
    player.smoothed = false;

    game.camera.follow(player);
};

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
