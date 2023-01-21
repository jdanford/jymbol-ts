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
export type QuoteType = (typeof quoteTypes)[QuoteKey];

export class Quoted implements ObjectValue {
    readonly quote: QuoteType;
    readonly value: Value;

    constructor(quote: QuoteType, value: Value) {
        this.quote = quote;
        this.value = value;
    }

    hashCode(): number {
        return hash("quoted", this.quote, this.value);
    }
}
