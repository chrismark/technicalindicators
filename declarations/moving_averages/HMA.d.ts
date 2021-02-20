import { Indicator } from '../indicator/indicator';
import { MAInput } from './SMA';
export declare class HMA extends Indicator {
    period: number;
    price: number[];
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: MAInput);
    static calculate: typeof hma;
    nextValue(price: number): number | undefined;
}
export declare function hma(input: MAInput): number[];
