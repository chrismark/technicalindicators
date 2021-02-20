"use strict";
import { Indicator } from '../indicator/indicator';
import { WMA } from './WMA';
export class HMA extends Indicator {
    constructor(input) {
        super(input);
        var period = input.period;
        var priceArray = input.values;
        var wma0;
        var wma1;
        var wmaDiff;
        this.result = [];
        wma0 = new WMA({ period: Math.floor(period / 2), values: [] });
        wma1 = new WMA({ period: period, values: [] });
        wmaDiff = new WMA({ period: Math.floor(Math.sqrt(period)), values: [] });
        this.generator = (function* () {
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
            var result = this.generator.next(tick);
            if (result.value != undefined) {
                this.result.push(this.format(result.value));
            }
        });
    }
    //STEP 5. REMOVE GET RESULT FUNCTION
    nextValue(price) {
        var result = this.generator.next(price).value;
        if (result != undefined)
            return this.format(result);
    }
    ;
}
HMA.calculate = hma;
;
export function hma(input) {
    Indicator.reverseInputs(input);
    var result = new HMA(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}
