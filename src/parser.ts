// adapted from https://github.com/fwg/s-expression

import { SyntaxError } from "./error";
import { Quoted, QuoteKey, quoteTypes } from "./quoted";
import { Atom, Value } from "./value";
import { VM } from "./vm";

const whitespace = /\s/;
const nonSymbol = /\s|\\|"|'|`|,|\(|\)/;
const stringOrEscaped = /^(\\|"|$)/;
const digit = /[0-9]/;
const stringDelimiter = /["]/;
const quote = /['`,]/;

export class Parser {
    private readonly vm: VM;
    private readonly input: string;
    private line: number;
    private col: number;
    private pos: number;

    constructor(vm: VM, input: string) {
        this.vm = vm;
        this.input = input;
        this.line = 0;
        this.col = 0;
        this.pos = 0;
    }

    static parse(vm: VM, input: string): Value {
        const parser = new Parser(vm, input);
        const value = parser.value();

        if (value === undefined) {
            throw parser.syntaxError("Can't parse empty valueession");
        }

        const extraChars = parser.peek();
        if (extraChars) {
            throw parser.syntaxError(`Unrecognized characters: \`${extraChars}\``);
        }

        return value;
    }

    syntaxError(message: string): SyntaxError {
        const line = this.line + 1;
        const col = this.col + 1;
        return new SyntaxError(message, line, col);
    }

    fail(message: string): never {
        throw this.syntaxError(message);
    }

    peek(): string {
        if (this.input.length === this.pos) {
            return "";
        }

        return this.input[this.pos];
    }

    consume(): string {
        if (this.input.length === this.pos) {
            return "";
        }

        let c = this.input[this.pos];
        this.pos += 1;

        if (c === "\r") {
            if (this.peek() === "\n") {
                this.pos += 1;
                c += "\n";
            }
            this.line += 1;
            this.col = 0;
        } else if (c === "\n") {
            this.line += 1;
            this.col = 0;
        } else {
            this.col += 1;
        }

        return c;
    }

    readWhile(predicate: (c: string) => boolean): string {
        let s = "";

        while (predicate(this.peek())) {
            s += this.consume();
        }

        return s;
    }

    readWhileMatches(regex: RegExp): string {
        return this.readWhile((c) => regex.test(c));
    }

    readWhileNotMatches(regex: RegExp): string {
        return this.readWhile((c) => !regex.test(c));
    }

    skipWhitespace(): void {
        this.readWhileMatches(whitespace);
    }

    value(): Value | undefined {
        this.skipWhitespace();
        const next = this.peek();

        if (quote.test(next)) {
            return this.quoted();
        }

        const value = next === "(" ? this.list() : this.atom();
        this.skipWhitespace();
        return value;
    }

    atom(): Atom | undefined {
        let next = this.peek();

        if (digit.test(next)) {
            return this.number();
        }

        if (stringDelimiter.test(next)) {
            return this.string();
        }

        let string = "";

        while (true) {
            string += this.readWhileNotMatches(nonSymbol);
            next = this.peek();

            if (next === "\\") {
                this.consume();
                string += this.consume();
                continue;
            }

            break;
        }

        return string ? this.vm.symbolTable.intern(string) : undefined;
    }

    number(): number {
        let string = "";
        string += this.readWhileMatches(digit);
        return Number.parseInt(string);
    }

    string(): string {
        // consume "
        const delimiter = this.consume();
        let string = "";

        while (true) {
            string += this.readWhileNotMatches(stringOrEscaped);
            let next = this.peek();

            if (next === "") {
                this.fail(`Unterminated string literal: \`${string}\``);
            }

            if (next === delimiter) {
                this.consume();
                break;
            }

            if (next === "\\") {
                this.consume();
                next = this.peek();

                if (next === "r") {
                    this.consume();
                    string += "\r";
                } else if (next === "t") {
                    this.consume();
                    string += "\t";
                } else if (next === "n") {
                    this.consume();
                    string += "\n";
                } else if (next === "f") {
                    this.consume();
                    string += "\f";
                } else if (next === "b") {
                    this.consume();
                    string += "\b";
                } else {
                    string += this.consume();
                }

                continue;
            }

            string += this.consume();
        }

        return string;
    }

    quoted(): Quoted<Value> {
        let quoteChar = this.consume() as QuoteKey;
        let quoteType = quoteTypes[quoteChar];

        const next = this.peek();

        if (quoteType === "unquote" && next === "@") {
            this.consume();
            quoteType = "unquote-splicing";
            quoteChar = ",@";
        }

        this.skipWhitespace();
        const quotedValue = this.value();
        if (quotedValue === undefined) {
            this.fail(`Expected value after \`${quoteChar}\``);
        }

        return new Quoted<Value>(quoteType, quotedValue);
    }

    list(): Value {
        let next = this.peek();
        if (next !== "(") {
            this.fail(`Expected \`(\`, got \`${next}\``);
        }

        this.consume();

        const values: Value[] = [];
        let value = this.value();

        if (value !== undefined) {
            values.push(value);

            while ((value = this.value()) !== undefined) {
                values.push(value);
            }
        }

        next = this.peek();
        if (next !== ")") {
            this.fail(`Expected \`)\`, got ${next}`);
        }

        this.consume();

        return this.vm.heap.allocList(values);
    }
}
