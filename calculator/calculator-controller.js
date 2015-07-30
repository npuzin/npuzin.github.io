function CalculatorController($scope) {

  var DELETE = 46;
  var ENTER = 13;

  $scope.calculator = new Calculator();

  $scope.keyPress = function($event) {
    var expectedKeys = ['0','1','2','3','4','5','6','7','8','9','0','+','-','*','/','.','(',')'];
    var key = String.fromCharCode($event.charCode);
    if (expectedKeys.indexOf(key) >= 0)
      $scope.calculator.add(key);
  };

  $scope.keyDown = function($event) {

    switch ($event.keyCode) {
      case DELETE:
        $scope.calculator.clear();
        break;
      case ENTER:
        $scope.calculator.calculate();
        break;
    }

  };

  $scope.keyPressed = function(key) {
    switch (key) {
      case 'C':
        $scope.calculator.clear();
        break;
      case '=':
        $scope.calculator.calculate();
        break;
      default:
        $scope.calculator.add(key);
        break;
    }

  }
}
