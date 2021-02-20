/**
 * Created by chrismark on 02/19/21.
 */
var HMA = require('../../lib/moving_averages/HMA').HMA;
var assert = require('assert');
var data   = require('../data');

var prices = data.close;
var expectedResult = [
  149.03103703703704,
  162.86866666666668,
  183.19474074074074,
  207.51807407407404,
  233.28077777777776,
  252.44770370370375,
  274.5346296296297,
  290.52233333333334
];
var period = 9;

describe('HMA (Hull Moving Average)', function() {
  it('should calculate HMA using the calculate method', function() {
    assert.deepEqual(HMA.calculate({
      period : period,
      values : prices
    }), expectedResult, 'Wrong Results');
  });

  it('should be able to get HMA for the next bar', function() {
    var hma = new HMA({
      period : period,
      values : prices
    });
    assert.deepEqual(hma.getResult(),  expectedResult, 'Wrong Results while getting results');
  })

  it('should be able to get HMA for the next bar using nextValue', function() {
    var hma = new HMA({
      period : period,
      values : []
    });
    var results = [];
    prices.forEach(price => {
      var result = hma.nextValue(price);
      if(result)
        results.push(result)
    });
    assert.deepEqual(results,  expectedResult, 'Wrong Results while getting results');
  })
})
