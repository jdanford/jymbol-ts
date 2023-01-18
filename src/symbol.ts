import { hash } from "./hash";
import { ObjectValue } from "./objectValue";

export class Symbol implements ObjectValue {
    readonly index: number;

    private constructor(index: number) {
        this.index = index;
    }

    hashCode(): number {
        return hash("symbol", this.index);
    }

    private static readonly symbols: Symbol[] = [];

    static fromIndex(index: number): Symbol {
        if (index >= this.symbols.length) {
            const symbol = new Symbol(index);
            this.symbols[index] = symbol;
            return symbol;
        }

        return this.symbols[index] as Symbol;
    }

    static readonly nil = Symbol.fromIndex(0);
    static readonly cons = Symbol.fromIndex(1);
    static readonly fn = Symbol.fromIndex(2);
    static readonly ["native-fn"] = Symbol.fromIndex(3);
}
