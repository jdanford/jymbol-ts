import { Ref } from "./ref";
import { sized, SizedArray } from "./sized";
import { Symbol } from "./symbol";
import { checkType, tryAsRef } from "./utils";
import { Value } from "./value";

interface HeapRecord {
    readonly type: Symbol;
    readonly size: number;
    readonly offset: number;
}

export class Heap {
    private readonly data: Value[];
    private readonly records: HeapRecord[];

    constructor() {
        this.data = [];
        this.records = [];
    }

    alloc(type: Symbol, data: Value[]): Ref {
        const size = data.length;
        const offset = this.data.length;
        const index = this.records.length;

        const record = {
            type,
            size,
            offset,
        };

        this.data.push(...data);
        this.records.push(record);
        return Ref.fromIndex(index);
    }

    load(ref: Ref): [Symbol, Value[]] {
        const record = this.records[ref.index];
        const start = record.offset;
        const end = start + record.size;
        const data = this.data.slice(start, end);
        return [record.type, data];
    }

    loadChecked<N extends number>(
        ref: Ref,
        expectedType: Symbol,
        expectedSize: N,
    ): SizedArray<Value, N> {
        const [type, unsizedData] = this.load(ref);
        checkType(type, expectedType);
        return sized(unsizedData, expectedSize);
    }

    allocCons(head: Value, tail: Value): Ref {
        return this.alloc(Symbol.cons, [head, tail]);
    }

    loadConsRef(ref: Ref): [Value, Value] {
        return this.loadChecked(ref, Symbol.cons, 2);
    }

    allocList(values: Value[]): Value {
        let list: Value = Symbol.nil;
        for (let i = values.length - 1; i >= 0; i--) {
            const head = values[i];
            list = this.allocCons(head, list);
        }

        return list;
    }

    loadList(list: Value): Value[] {
        let ref = tryAsRef(list);
        let values: Value[] = [];

        while (true) {
            const [head, tail] = this.loadConsRef(ref);
            values.push(head);

            if (tail === Symbol.nil) {
                break;
            }

            ref = tryAsRef(tail);
        }

        return values;
    }
}
