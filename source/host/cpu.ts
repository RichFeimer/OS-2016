///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {
    
    
    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

                    var memry = new Memory(this.memSize);
                    this.memory = memry.bytes;
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public memSize: Number = 768;
        public memory: Byte[];
        
        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
        
        public execute(instr) : void {
            switch(instr) {
                case "a9":
                this.loadAccWithConst();
                break;
                case "ad":
                this.loadAccFromMem();
                break;
                case "8d":
                this.storeAccInMem();
                break;
                case "6d":
                this.addWithCarry();
                break;
                case "a2":
                this.loadXRegWithConst();
                break;
                case "ae":
                this.loadXRegFromMem();
                break;
                case "a0":
                this.loadYRegWithConst();
                break;
                case "ac":
                this.loadYRegFromMem();
                break;
                case "ea":
                this.noOp();
                break;
                case "00":
                this.breakProcess();
                break;
                case "ec":
                this.compareToXReg();
                break;
                case "d0":
                this.branchNotEqual();
                break;
                case "ee":
                this.incrByteVal();
                break;
                case "ff":
                this.sysCall();
                break;
                
                default:
                this.breakProcess();
            }
        }
        
        public increasePC(bytes): void {
            this.PC = (this.PC + bytes)
        }
        
        public loadAccWithConst(): void {
           this.Acc = this.getNextByte();
           this.increasePC(2);
        }
        
        public loadAccFromMem(): void {
           this.Acc = this.getNextTwoBytes();
           this.increasePC(3);
        }
        
        public storeAccInMem(): void {
           let address = this.getNextTwoBytes();
           this.writeByte(address, this.Acc.toString());
           this.increasePC(3);
        }
        
        public addWithCarry(): void {
           //TODO: Write code 
        }
        
        public loadXRegWithConst(): void {
           //TODO: Write code 
        }
        
        public loadXRegFromMem(): void {
           //TODO: Write code 
        }
        
        public loadYRegWithConst(): void {
           //TODO: Write code 
        }
        
        public loadYRegFromMem(): void {
           //TODO: Write code 
        }
        
        public noOp(): void {
           //Nothing to see here, just incrementing the program counter
           this.increasePC(1);
        }
        
        public breakProcess(): void {
           //TODO: Write code 
        }
        
        public compareToXReg(): void {
           //TODO: Write code 
        }
        
        public branchNotEqual(): void {
           //TODO: Write code 
        }
        
        public incrByteVal(): void {
           //TODO: Write code 
        }
        
        public sysCall(): void {
           //TODO: Write code 
        }
        
        public getNextByte(): number{
            return parseInt(((this.memory[this.PC + 1]).toString()),16);
        }
        
        public getNextTwoBytes(): number{
            return parseInt(((this.memory[this.PC + 2]).toString()) + ((this.memory[this.PC + 1]).toString()),16);
        }
        
        public writeByte (loc: number, byte: string) {
            if(byte.length < 2) {
                byte = "0" + byte;
            }
            this.memory[loc] = new Byte(byte);
        }
    }
}
