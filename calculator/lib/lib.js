(function(){

  var Scope = function (controllerName) {

    var $controllerName = controllerName;

    var querySelectorAll = function(query, callback) {

      return [].forEach.call(document.querySelectorAll('[np-controller='+ $controllerName+'] ' + query), callback);
    };

    var $apply = function(callback) {

      var _scope = this;
      querySelectorAll('[np-model]', function(ctrl) {
        var attr = ctrl.attributes['np-model'].nodeValue;
        _scope.$eval(attr+'=\'' + ctrl.value +'\'');
      });

      if (callback)
        callback();

      querySelectorAll('[np-model]', function(ctrl) {
        var attr = ctrl.attributes['np-model'].nodeValue;
        var newValue = _scope.$eval(attr);
        if (newValue !== ctrl.value)
          ctrl.value = newValue;
      });

      querySelectorAll('[np-bind]', function(ctrl) {
        var attr = ctrl.attributes['np-bind'].nodeValue;
        ctrl.textContent=_scope.$eval(attr);
      });

      querySelectorAll('[np-show]', function(ctrl) {
        var attr = ctrl.attributes['np-show'].nodeValue;
        var show = _scope.$eval(attr);
        if (show)
          ctrl.classList.add('np-hide');
        else
          ctrl.classList.remove('np-hide');
      });
    };

    var $eval = function(str,$event) {
      return eval('this.'+str);
    };

    var $addEventListeners = function(eventName) {

      var _scope = this;
      querySelectorAll('[np-' + eventName +']', function(ctrl) {

        ctrl.addEventListener(eventName, function(ev) {

          var handler = this.attributes['np-'+eventName].nodeValue;
          var $event = ev;
          setTimeout(function() {

            if (handler) {
              _scope.$apply(function() {
                _scope.$eval(handler,$event);
              });
            }
          });
        });
      });
    };

    var $initController = function() {

      var _scope = this;
      var events = ['keydown','keypress','keyup','click','change'];
      events.forEach(function(event) {
        _scope.$addEventListeners(event);
      });

      this.$apply(function() {
        eval($controllerName+'(_scope)');
      });
    };

    return {
      $apply: $apply,
      $eval: $eval,
      $initController: $initController,
      $addEventListeners: $addEventListeners
    }
  };

  var initControllers = function() {

    [].forEach.call(document.querySelectorAll('[np-controller]'), function(ctrl) {

      var controllerName = ctrl.attributes['np-controller'].nodeValue;
      var $scope = new Scope(controllerName);
      $scope.$initController();
    });
  };

  var style = document.querySelector('head').appendChild(document.createElement('style'));
  style.appendChild(document.createTextNode('.np-hide { display:none!important }'));

  document.addEventListener('DOMContentLoaded',function() {
    initControllers();
  });
})();
