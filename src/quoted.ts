import { hash } from "./hash";
import { ObjectValue } from "./objectValue";
import { Value } from "./value";

export const quoteTypes = {
    "'": "quote",
    "`": "quasiquote",
    ",": "unquote",
    ",@": "unquote-splicing",
} as const;

export type QuoteKey = keyof typeof quoteTypes;
export type QuoteType = typeof quoteTypes[QuoteKey];

export class Quoted<T extends Value> implements ObjectValue {
    readonly quote: QuoteType;
    readonly inner: T;

    constructor(quote: QuoteType, inner: T) {
        this.quote = quote;
        this.inner = inner;
    }

    hashCode(): number {
        return hash("quoted", this.quote, this.inner);
    }
}
