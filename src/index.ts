import { VM } from "./vm";

declare global {
    interface Window {
        vm: VM;
    }
}

window.vm = new VM();
