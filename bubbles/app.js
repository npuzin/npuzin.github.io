angular.module('bubbles', [])

  .controller('MyController', function($scope,game, $interval, $window) {

    var player1Canvas = document.getElementById('player1Canvas');
    player1Canvas.width = $window.innerWidth;
    var player1Context = player1Canvas.getContext('2d');
    var player2Canvas = document.getElementById('player2Canvas');
    player2Canvas.width = $window.innerWidth;
    var player2Context = player2Canvas.getContext('2d');
    var MAX_TIME = 60;
    var START_COUNTER = 2;

    game.init(player1Canvas,player1Context,player2Canvas,player2Context);

    var mainLoop = function() {

      requestAnimationFrame(mainLoop);
      game.draw();
    }
    mainLoop();

    $scope.onMouseMove = game.onMouseMove;
    $scope.onClick = game.onClick;
    $scope.onKeyDown = game.onKeyDown;
    $scope.onKeyUp = game.onKeyUp;

    $scope.status = START_COUNTER;
    $scope.time = 0;
    $scope.players = game.getPlayers();
    $scope.getWinner = function(hunter) {

      var winner;
      $scope.players.forEach(function(player) {

        if (player.isHunter && hunter) {
          winner = player.name;
        } else if (!player.isHunter && !hunter) {
          winner = player.name;
        }
      });
      return winner;
    }

    $scope.hasHuntersWon = function() {

      var result = false;
      $scope.players.forEach(function(hunter) {
        if (hunter.isHunter && hunter.wins === true)
          result = true;
      });
      return result;
    }

    var stopCounter = $interval(function() {

      // game not started
      if (angular.isNumber($scope.status)) {
        var stat = parseInt($scope.status)-1;
        if (stat === 0) {
          $scope.status = 'GO';
          $scope.time = 0;
          game.start();
        } else {
          $scope.status = stat;
        }
      }
      else {

        $scope.time++;

        if ($scope.hasHuntersWon()) {
          $scope.status = 'THE GAME IS OVER - Player ' + $scope.getWinner(true) + ' wins !' ;
          $interval.cancel(stopCounter);
        }
        else if ($scope.time >= MAX_TIME) {
          game.stop();
          $scope.status = 'THE GAME IS OVER - Player ' + $scope.getWinner(false) + ' wins !' ;
          $scope.players.forEach(function(hunter) {
          if (hunter.isHunter)
            hunter.score = 0;
        });
          $interval.cancel(stopCounter);
        }

      }
    },1000);
  });
