"use strict"
import { Indicator, IndicatorInput } from '../indicator/indicator';
import { MAInput } from './SMA';
import { WMA } from './WMA';
import { LinkedList } from '../Utils/LinkedList';

export class HMA extends Indicator{
  period:number;
  price:number[];
  result : number[];
  generator:IterableIterator<number | undefined>;
  constructor (input:MAInput) {
    super(input);
    var period = input.period;
    var priceArray = input.values;
    var wma0:WMA;
    var wma1:WMA;
    var wmaDiff:WMA;

    this.result = [];

    wma0 = new WMA({period : Math.floor(period/2), values :[]});
    wma1 = new WMA({period : period, values :[]});
    wmaDiff = new WMA({period : Math.floor(Math.sqrt(period)), values :[]});

    this.generator = (function* (){
      var tick = yield;
      var wma0Val;
      var wma1Val;
      var wmaDiffVal;
      var counter = 0;
      while (true) {
        wma0Val = wma0.nextValue(tick);
        wma1Val = wma1.nextValue(tick);
        wmaDiffVal = wmaDiff.nextValue(2 * wma0Val - wma1Val);
        if (wmaDiffVal >= 0 || wmaDiffVal <= 0) {
          tick = yield wmaDiffVal;
        }
        else {
          tick = yield;
        }
      }
    })();

    this.generator.next();

    priceArray.forEach((tick, index) => {
      var result = this.generator.next(tick)
      if(result.value != undefined){
        this.result.push(this.format(result.value));
      }
    });
  }

  static calculate = hma;

    //STEP 5. REMOVE GET RESULT FUNCTION
  nextValue(price:number):number | undefined {
      var result = this.generator.next(price).value;
      if(result != undefined)
          return this.format(result);
  };

};

export function hma(input:MAInput):number[] {
      Indicator.reverseInputs(input);
      var result = new HMA(input).result;
      if(input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
