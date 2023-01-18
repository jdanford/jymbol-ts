import { Map } from "immutable";
import { Symbol } from "./symbol";
import { Value } from "./value";

export type Env = Map<Symbol, Value>;

const pairs: [Symbol, Value][] = [
    [Symbol.nil, Symbol.nil],
    [Symbol.cons, Symbol.cons],
    [Symbol.fn, Symbol.fn],
];

export const initialEnv: Env = Map(pairs);
