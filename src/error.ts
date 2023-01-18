export class SyntaxError extends Error {
    readonly line: number;
    readonly col: number;

    constructor(message: string, line: number, col: number) {
        super(message);
        this.line = line;
        this.col = col;
    }
}
