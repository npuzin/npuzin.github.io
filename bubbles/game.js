angular.module('bubbles')

  .factory('game', function(utils) {

    var stopped = true;
    var moveSpeed = 30;
    var canvas;
    var context;
    var MAX_SPEED = 100;
    var NB_COINS = 10;
    var mouse = {x:0,y:0,dist:0,angle:0};
    var keyboard = {
      left: false,
      right: false,
      top:false,
      bottom:false,
      move: {
        angle:0,
        dist:0
      }
    };

    var board = {
      width: 1000,
      height:1000
    };

    var player1 = {
      position: {x:0, y:-board.height/2+50},
      //position: {x:-20, y:0},
      size: 10,
      isHunter: false,
      name:'red',
      score: 0,
      color:utils.colors.red
    };
    var player2 = {
      position: {x:0, y:board.height/2-50},
      //position: {x:20, y:0},
      size: 10,
      name:'blue',
      isHunter: true,
      score: NB_COINS,
      color:utils.colors.blue
    };
    var players = [player1,player2];

    var bubbles = {
      size:5,
      number:100,
      items:[]
    };

    var stop = function() {
      stopped = true;
    };

    var start = function() {
      stopped = false;
    };

    var draw = function() {

      if (!stopped) {
        player1.position = utils.move(player1, Math.min(MAX_SPEED,mouse.dist)/moveSpeed,mouse.angle,board, bubbles, players);
        var player2Move = utils.getMoveFromKeyboard(keyboard,MAX_SPEED);
        player2.position = utils.move(player2, player2Move.dist / moveSpeed, player2Move.angle,board, bubbles, players);

        players.forEach(function(player) {

          if (player.isHunter && player.wins) {
            stop();
          }
        });

      }

      utils.clear(player1Canvas,player1Context,bubbles);
      utils.drawGrid(player1Canvas,player1Context, {x:-player1.position.x,y:-player1.position.y},20);
      utils.drawBorders(player1Canvas,player1Context,board, player1, bubbles);
      utils.drawBubbles(player1Canvas,player1Context,bubbles,player1);
      utils.drawBubble(player1Canvas,player1Context, player1, {x:0,y:0});
      utils.drawBubble(player1Canvas,player1Context, player2, {
        x:player2.position.x-player1.position.x,
        y:player2.position.y-player1.position.y});

      utils.clear(player2Canvas,player2Context);
      utils.drawGrid(player2Canvas,player2Context, {x:-player2.position.x,y:-player2.position.y},20);
      utils.drawBorders(player2Canvas,player2Context,board, player2, bubbles);
      utils.drawBubbles(player2Canvas,player2Context,bubbles,player2);
      utils.drawBubble(player2Canvas,player2Context, player1, {
        x:player1.position.x-player2.position.x,
        y:player1.position.y-player2.position.y});
      utils.drawBubble(player2Canvas,player2Context, player2, {x:0,y:0});

    };

    var init = function(_player1Canvas, _player1Context, _player2Canvas, _player2Context) {

      player1Canvas = _player1Canvas;
      player2Canvas = _player2Canvas;
      player1Context = _player1Context;
      player2Context = _player2Context;

      utils.initRandomBubbles(board,bubbles, NB_COINS);
    };

    var onMouseMove = function($event) {
      mouse = utils.getMouseDetails(player1Canvas,$event);
    };

    var onClick = function($event) {

    };

    var onKeyDown = function($event) {
      utils.processKeyDown(keyboard,$event);
    };

    var onKeyUp = function($event) {
      utils.processKeyUp(keyboard,$event);
    };
    var getPlayers = function() {
       return players;
    }

    return {
      draw: draw,
      init: init,
      onMouseMove:onMouseMove,
      onClick: onClick,
      onKeyDown: onKeyDown,
      onKeyUp: onKeyUp,
      start: start,
      stop: stop,
      getPlayers: getPlayers
    }
  });
