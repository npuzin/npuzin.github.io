function Calculator() {

  var calculation = '0';

	var calculate = function() {
		try {
      calculation = eval(calculation);
    }
    catch(err) {
      console.error('Error:',err);
      calculation = '#ERROR';
    }
	};

  var clear = function() {
    calculation = '0';
  };

  var add = function(key) {
    if (calculation === '0')
      calculation = key;
    else
      calculation += key;
  };

  var getCalculation = function() {
    return calculation;
  }

	return {
		calculate: calculate,
    clear: clear,
    add: add,
    getCalculation:getCalculation
	}
}
