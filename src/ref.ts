import { hash } from "./hash";
import { ObjectValue } from "./objectValue";

export class Ref implements ObjectValue {
    readonly index: number;

    private constructor(index: number) {
        this.index = index;
    }

    hashCode(): number {
        return hash("ref", this.index);
    }

    private static readonly refs: Ref[] = [];

    static fromIndex(index: number): Ref {
        if (index >= this.refs.length) {
            const ref = new Ref(index);
            this.refs[index] = ref;
            return ref;
        }

        return this.refs[index] as Ref;
    }
}
