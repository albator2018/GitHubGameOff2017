var player;
var idle, right, left, up, down;
var enemies;
var throwBackArray = [];
var tb = 0;

bootState = {
  preload: function() {
    game.load.image("progressBar", "assets/sprites/preloader.png"),
    game.load.image("progressBarBg", "assets/sprites/preloaderbg.png"),
    game.load.image("loader", "assets/sprites/loader.png")
  },
  create: function() {
    game.state.start("load")
  }
},
loadState = {
  preload: function() {
    var a = game.add.image(game.world.centerX, 150, "loader");
    a.anchor.setTo(.5, .5);
    var b = game.add.sprite(game.world.centerX, 200, "progressBarBg");
    b.anchor.setTo(.5, .5);
    var c = game.add.sprite(game.world.centerX, 200, "progressBar");
    c.anchor.setTo(.5, .5),
    game.load.setPreloadSprite(c),

    game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);

    game.load.spritesheet('sprite', 'assets/sprites/spritesheet.png', 48, 48);
    game.load.spritesheet('enemy', 'assets/sprites/spritesheet-enemy.png', 48, 48);
    game.load.image('home', 'assets/sprites/home.png');

    game.load.image('learn', 'assets/sprites/learn.png');
    game.load.image('phaser2', 'assets/sprites/phaser2.png');

    game.load.image('spacebar', 'assets/buttons/spacebar.png');
  },
  create: function() {
    game.state.start("splash")
  }
},
splashState = {
  create: function() {
    var pic = game.add.image(game.world.centerX, game.world.centerY, 'learn');
    pic.anchor.set(0.5);
    pic.alpha = 0.1;
    //  This tween will wait 2 seconds before starting
    var tween = game.add.tween(pic).to( { alpha: 1 }, 2000, "Linear", true, 500);
    tween.onComplete.add(this.startMenu, this)
  },
  startMenu: function() {
    game.state.start("menu")
  }
},
menuState = {
  create: function() {
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var sBar = game.add.sprite(320, 240, 'spacebar');
    sBar.anchor.setTo(0.5, 0.5);
    sBar.alpha = 0;
    var tween = game.add.tween(sBar).to( { alpha: 1 }, 500, "Linear", true, 0, -1);
    tween.yoyo(true, 500);
  },
  update: function() {
    if (spaceKey.isDown){
      console.log("spacebar");
      game.state.start('play');
    }
  }
},
playState = {
  create: function() {
    this.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    game.world.setBounds(0, 0, 1024, 768);

    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    };

    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(this.getCoordinates, this);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.addPlayer(100, 100);
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
        this.addEnemies(Math.random() * 1024, Math.random() * 768);
    };

    home = game.add.sprite(1024 - 217, 768 - 244, 'home');
    game.physics.arcade.enable(home);

    //throwback
    tBack = game.add.sprite(320, 240, 'learn');
    tBack.anchor.setTo(0.5, 0.5);
    tBack.alpha = 0;
    tBack.fixedToCamera = true;
  },
  update: function() {
    game.physics.arcade.overlap(player, enemies, this.collisionHandler, null, this);
    game.physics.arcade.overlap(player, home, this.collisionHome, null, this);
  },

  collisionHandler : function(){
    //game.add.tween(tBack).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    player.kill();
    this.addPlayer(throwBackArray[tb-1][0].x*32,throwBackArray[tb-1][0].y*32);

  },

  collisionHome : function(){
    game.state.start("win");
  },

  getCoordinates : function(layer, pointer){
    this.movePlayer(pointer.worldX,pointer.worldY);
  },

  addPlayer : function(x, y){
    player = game.add.sprite(x, y, 'sprite', 0);
    player.smoothed = false;
    game.physics.arcade.enable(player);

    game.camera.follow(player);
  },

  addEnemies : function(x, y){
    enemy = game.add.sprite(x, y, 'enemy', 0);
    enemy.smoothed = false;
    game.physics.arcade.enable(enemy);
    enemies.add(enemy);
  },

  movePlayer : function(x, y){
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

  }
},
winState = {
  create: function() {
    youWin = game.add.sprite(320, 240, 'phaser2');
    youWin.anchor.setTo(0.5, 0.5);
    youWin.alpha = 0;
    youWin.fixedToCamera = true;
    var tween = game.add.tween(youWin).to( { alpha: 1 }, 2000, "Linear", true, 0, 5);
    tween.onComplete.add(this.startMenu, this)
  },
  startMenu: function() {
    game.state.start("menu")
  }
},

game = new Phaser.Game(20*32, 15*32);
var easystar = new EasyStar.js();
game.state.add("boot", bootState),
game.state.add("load", loadState),
game.state.add("splash", splashState),
game.state.add("menu", menuState),
game.state.add("play", playState),
game.state.add("win", winState),
game.state.start("boot");
