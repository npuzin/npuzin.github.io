angular.module('bubbles')

  .factory('utils', function() {

    var keys = {
      LEFT: 37,
      TOP:38,
      RIGHT: 39,
      BOTTOM:40
    };

    var drawVector = function(canvas,context, dist, angle) {


      context.beginPath();
      var pos = {
        x: canvas.width/2,
        y:canvas.height/2
      };
      context.moveTo(pos.x,pos.y);
      var newPos = move(pos,dist,angle);
      context.lineTo(newPos.x,newPos.y);
      context.lineWidth = 1;
      context.strokeStyle = 'grey';
      context.stroke();
    };

    var move = function(bubble,dist,angle,board, bubbles, players) {

      var move = {
        x: dist*Math.cos(angle),
        y: -dist*Math.sin(angle)
      };

      move = collision(move, bubble,board, bubbles, players);
      return {
        x:round(bubble.position.x+move.x),
        y:round(bubble.position.y+move.y)
      };
    }

    var inter = function(point, rect) {

      var res = (point.x >= rect.position.x && point.x <= rect.position.x + rect.width
        && point.y >= rect.position.y && point.y <= rect.position.y + rect.height);
      return res;
    };

    var intersect = function(rect1, rect2) {

      var a = {x:rect1.position.x,y:rect1.position.y};
      var b = {x:rect1.position.x+rect1.width,y:rect1.position.y};
      var c = {x:rect1.position.x,y:rect1.position.y+rect1.height};
      var d = {x:rect1.position.x+rect1.width,y:rect1.position.y+rect1.height};

      var e = {x:a.x + rect1.width/2,y:a.y};
      var f = {x:d.x ,y:d.y-rect1.height/2};
      var g = {x:a.x ,y:a.y+rect1.height/2};
      var h = {x:d.x-rect1.width/2 ,y:d.y};

      return inter(a,rect2) || inter(b,rect2) || inter(c,rect2) || inter(d,rect2)
      || inter(e,rect2) || inter(f,rect2) || inter(g,rect2) || inter(h,rect2);
    };

    var collision = function(move, bubble,board,bubbles, players) {

      if (bubble.position.x+move.x < -board.width/2 || bubble.position.x+move.x > board.width/2) {
        move.x=0;
      }
      if (bubble.position.y+move.y < -board.height/2 || bubble.position.y+move.y > board.height/2) {
        move.y=0;
      }

      var bubbleRect = {
        position: {
          x: bubble.position.x-bubble.size+move.x,
          y: bubble.position.y-bubble.size+move.y
        },
        width:2*bubble.size,
        height: 2*bubble.size
      };

      // coins and obstacle collisions
      bubbles.items.forEach(function (curr) {

        if (curr.type === 'coin_taken') {
          return;
        }

        var currRect = {
          position: {
            x: curr.position.x-bubbles.size,
            y: curr.position.y-bubbles.size
          },
          width:2*bubbles.size,
          height: 2*bubbles.size
        };

        if (intersect(bubbleRect, currRect)) {

          if (curr.type === 'obstacle') {
            if (Math.abs(move.x) > Math.abs(move.y)) {
              move.x=0;
            } else {
              move.y=0;
            }

          } else if (!bubble.isHunter) {
            curr.type = 'coin_taken';
            bubble.score++;
            players.forEach(function(hunter) {
              if (hunter.isHunter) {
                hunter.score--;
              }
            })
          }

        }
      });

      // hunter collision
      if (bubble.isHunter) {

        players.forEach(function (curr) {

          if (curr.isHunter === true) {
            return;
          }

          var currRect = {
            position: {
              x: curr.position.x-bubbles.size,
              y: curr.position.y-bubbles.size
            },
            width:2*bubbles.size,
            height: 2*bubbles.size
          };

          if (intersect(bubbleRect, currRect)) {

            curr.score = 0;
            bubble.wins = true;
          }
        });
      }
      return move;
    };

    var round = function(n) {

      return Math.round(n*100)/100;
    };

    var drawGrid = function(canvas,context, position,size) {

      var i;
      var pos = {
        x:(position.x % size),
        y:(position.y % size),
      }
      context.beginPath();
      for (i=0;i<=Math.ceil(canvas.width/size);i++) {

        context.moveTo(pos.x+i*size, pos.y+0-size);
        context.lineTo(pos.x+i*size, pos.y+canvas.height+size);
      }
      for (i=0;i<=Math.ceil(canvas.height/size);i++) {

        context.moveTo(pos.x+0-size,pos.y+i*size);
        context.lineTo(pos.x+canvas.width+size,pos.y+i*size);
      }
      context.lineWidth = 0.5;
      context.strokeStyle = 'grey';
      context.stroke();
    };

    var stretchText = function(context,text,width,pos) {
      var _width = context.measureText(text).width;

      context.save();
      var fact = width / _width;
      context.scale(fact, fact);
      context.fillText(text, 20, 40);
      context.restore();

    }

    var colors = {
      green: {fill:'#0f0',stroke:'#0c0'},
      red: {fill:'#f00',stroke:'#c00'},
      black: {fill:'#444',stroke:'#000'},
      blue: {fill:'#00f',stroke:'#00c'},
      yellow: {fill:'yellow',stroke:'orange'}
    }

    var drawText = function(context, text, pos, textColor, fontStyle) {

      var _textColor = textColor || colors.black;
      context.beginPath();
      context.fillStyle = _textColor.stroke;
      context.font = fontStyle || '11px Verdana';
      context.fillText(text,pos.x,pos.y);
      context.stroke();
    };

    var drawTextInRect = function(canvas,context, text, pos, width, height, textColor) {

      context.beginPath();
      context.strokeStyle = 'black';
      context.fillStyle = textColor;
      context.font = height + 'px Verdana';
      context.lineWidth = 1;
      var w = context.measureText(text).width;
      var shiftX = (width-w) /2;
      shiftX = shiftX >= 0 ? shiftX : 0;
      var shiftY = height/8;
      context.fillText(text,canvas.width/2+pos.x+shiftX,canvas.height/2+pos.y+height-shiftY,width);
      context.stroke();
    };

    var drawBubble = function(canvas,context, bubble, pos) {

      context.beginPath();
      context.arc(canvas.width/2+pos.x, canvas.height/2+pos.y, bubble.size, 0, 2 * Math.PI, false);
      context.fillStyle = bubble.color.fill;
      context.fill();
      context.lineWidth = 4;
      context.strokeStyle = bubble.color.stroke;
      context.stroke();
      if (bubble.isHunter) {
        drawTextInRect(canvas,context,'H',{
            x:pos.x-1.6*bubble.size/2,
            y:pos.y-bubble.size/2},
          1.6*bubble.size,
          bubble.size, 'white');
      }
    };

    var clear = function(canvas,context) {

      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    var getDistance = function(x,y) {

      return Math.sqrt(x*x+y*y);
    }

    var radToDeg = function(rad) {
      return Math.round(180*rad /Math.PI);
    }

    var getAngle = function(x,y) {
      if (x===0 && y ===0)
        return 0;
      var a = Math.abs(Math.atan(y/x));
      if (x<0) {
        a = Math.PI/2+(Math.PI/2-a);
      }
      if (y<0) {
        return -a;
      } else {
        return a;
      }
    };

    var getMouseDetails = function(canvas,ev) {
      var mouse = {
        x: ev.clientX-canvas.offsetLeft - canvas.width/2,
        y: -(ev.clientY-canvas.offsetTop - canvas.height/2)
      }
      mouse.dist = Math.round(getDistance(mouse.x,mouse.y));
      mouse.angle = getAngle(mouse.x,mouse.y);
      return mouse;
    }

    var drawMouseDetails = function(context,mouse) {
      drawText(context,'Mouse: (' + mouse.x + ',' + mouse.y + ','
        + mouse.dist + ',' + radToDeg(mouse.angle) + '°)',{x:10,y:20});
    };
    var drawBubbleDetails = function(context,bubble) {
      drawText(context,'Bubble: (' + bubble.position.x + ',' + bubble.position.y + ')',{x:10,y:40});
    };
    var translate = function(pos,vector) {
      return  {
          x:round(pos.x+vector.x),
          y:round(pos.y+vector.y)
        };
    };
    var drawBubbles = function(canvas,context, bubbles, mainBubble) {

      bubbles.items.forEach(function(bubble) {

        var pos = {x:bubble.position.x-mainBubble.position.x,y:bubble.position.y-mainBubble.position.y};
        if (bubble.type === 'obstacle' || bubble.type === 'coin') {
          drawBubble(canvas,context, bubble, pos);
        }
      });
    };

    var initRandomBubbles = function(board,bubbles, nbCoins) {

      var number = bubbles.number;
      bubbles.items = [];
      for (var i=0;i<number;i++) {
        var x = Math.round((Math.random()-0.5)*board.width);
        var y = Math.round((Math.random()-0.5)*board.height);
        bubbles.items.push({position: {x:x, y:y}, color:colors.black, size: bubbles.size, type:'obstacle'});
      }

      for (var i=0;i<nbCoins;i++) {
        var x = Math.round((Math.random()-0.5)*board.width);
        var y = Math.round((Math.random()-0.5)*board.height);
        bubbles.items.push({position: {x:x, y:y}, color:colors.yellow, size: bubbles.size,  type:'coin'});
      }
    };

    var drawBorders = function(canvas,context,board, bubble, bubbles) {

      var boardColor = 'white';
      var rect = {
        position: {
          x: -board.width/2-bubbles.size,
          y: -board.height/2-bubbles.size
        },
        width: board.width+2*bubbles.size,
        height: board.height+2*bubbles.size
      };
      rect.position = {
        x: rect.position.x - bubble.position.x + canvas.width/2,
        y: rect.position.y - bubble.position.y + canvas.height/2
      };

      context.beginPath();
      context.fillStyle = boardColor;
      context.strokeStyle = boardColor;
      context.rect(rect.position.x-2*canvas.width, rect.position.y-2*canvas.height, 2*canvas.width,rect.height+4*canvas.height);
      context.stroke();
      context.fill();

      context.beginPath();
      context.fillStyle = boardColor;
      context.strokeStyle = boardColor;
      context.rect(rect.position.x+rect.width, rect.position.y-2*canvas.height, 2*canvas.width,rect.height+4*canvas.height);
      context.stroke();
      context.fill();

      context.beginPath();
      context.fillStyle = boardColor;
      context.strokeStyle = boardColor;
      context.rect(rect.position.x-2*canvas.width, rect.position.y-2*canvas.height, rect.width+4*canvas.width, 2*canvas.height);
      context.stroke();
      context.fill();

      context.beginPath();
      context.fillStyle = boardColor;
      context.strokeStyle = boardColor;
      context.rect(rect.position.x-2*canvas.width, rect.position.y+rect.height, rect.width+4*canvas.width, 2*canvas.height);
      context.stroke();
      context.fill();

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = colors.black.stroke;
      context.rect(rect.position.x, rect.position.y, rect.width, rect.height);
      context.stroke();

    };

    var getMoveFromKeyboard = function(keyboard, speed) {

      var left = keyboard.left && !keyboard.right;
      var right = keyboard.right && !keyboard.left;
      var top = keyboard.top && !keyboard.bottom;
      var bottom = keyboard.bottom && !keyboard.top;

      if(right === true && keyboard.top === true) {
        return {angle: Math.PI/4, dist:speed};
      }
      else if(right === true && keyboard.bottom === true) {
        return {angle: -Math.PI/4, dist:speed};
      }
      else if(right === true) {
        return {angle: 0, dist:speed};
      }
      else if(left === true && keyboard.top === true) {
        return {angle: 3*Math.PI/4, dist:speed};
      }
      else if(left === true && keyboard.bottom === true) {
        return {angle: -3*Math.PI/4, dist:speed};
      }
      else if(left === true) {
        return {angle: -Math.PI, dist:speed};
      }
      else if(top === true) {
        return {angle: Math.PI/2, dist:speed};
      }
      else if(bottom === true) {
        return {angle: -Math.PI/2, dist:speed};
      }
      else {
        return {angle: 0, dist:0};
      }
    };

    var processKeyDown = function(keyboard, $event) {
      var key = $event.which;
      switch(key) {
        case keys.LEFT:
          keyboard.left = true;
          break;
        case keys.RIGHT:
          keyboard.right = true;
          break;
        case keys.TOP:
          keyboard.top = true;
          break;
        case keys.BOTTOM:
          keyboard.bottom = true;
          break;
      }
    };

    var processKeyUp = function (keyboard, $event) {
      var key = $event.which;
      switch(key) {
        case keys.LEFT:
          keyboard.left = false;
          break;
        case keys.RIGHT:
          keyboard.right = false;
          break;
        case keys.TOP:
          keyboard.top = false;
          break;
        case keys.BOTTOM:
          keyboard.bottom = false;
          break;
      }
    }

    return {
      drawGrid: drawGrid,
      clear:clear,
      drawBubble:drawBubble,
      drawTextInRect:drawTextInRect,
      colors:colors,
      drawText:drawText,
      getDistance: getDistance,
      radToDeg: radToDeg,
      getAngle: getAngle,
      drawVector: drawVector,
      getMouseDetails: getMouseDetails,
      move:move,
      drawMouseDetails: drawMouseDetails,
      drawBubbleDetails:drawBubbleDetails,
      translate:translate,
      drawBubbles: drawBubbles,
      initRandomBubbles:initRandomBubbles,
      drawBorders:drawBorders,
      keys: keys,
      getMoveFromKeyboard: getMoveFromKeyboard,
      processKeyDown: processKeyDown,
      processKeyUp: processKeyUp
    }

  });
