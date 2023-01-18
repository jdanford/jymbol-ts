import { Symbol } from "./symbol";

export class SymbolTable {
    private readonly strings: string[];
    private readonly indices: Map<string, number>;

    constructor() {
        this.strings = [];
        this.indices = new Map();

        const staticSymbolStrings = ["nil", "cons", "fn", "native-fn"] as const;
        for (let string of staticSymbolStrings) {
            const symbol = Symbol[string];
            this.set(string, symbol.index);
        }
    }

    private set(string: string, index: number) {
        this.strings.push(string);
        this.indices.set(string, index);
    }

    intern(string: string): Symbol {
        let index = this.indices.get(string);
        if (index !== undefined) {
            return Symbol.fromIndex(index);
        }

        index = this.strings.length;
        this.set(string, index);

        return Symbol.fromIndex(index);
    }

    resolve(symbol: Symbol): string {
        return this.strings[symbol.index];
    }
}
