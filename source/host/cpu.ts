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

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        
        public updateCPU(currentProcess: pcb):void {
            this.PC = currentProcess.PC;
            this.Acc = currentProcess.Acc;
            this.Xreg = currentProcess.Xreg;
            this.Yreg = currentProcess.Yreg;
            this.Zflag = currentProcess.Zflag;
        }

        
        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if(this.isExecuting){
                let opcode = _memManager.readByte(this.PC);
                this.execute(opcode);
            }
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
           this.Acc = _memManager.getNextByte();
           this.increasePC(2);
        }
        
        public loadAccFromMem(): void {
           this.Acc = _memManager.getNextTwoBytes();
           this.increasePC(3);
        }
        
        public storeAccInMem(): void {
           let address = _memManager.getNextTwoBytes();
           _memManager.writeByte(address, this.Acc.toString());
           this.increasePC(3);
        }
        
        public addWithCarry(): void {
            let address = _memManager.getNextTwoBytes();
            let sum: number = parseInt((_memManager.memory[address].byte), 16) + parseInt(this.Acc.toString(), 16);
            this.Acc = sum;
            this.increasePC(3);
        }
        
        public loadXRegWithConst(): void {
           this.Xreg = _memManager.getNextByte();
           this.increasePC(2);
        }
        
        public loadXRegFromMem(): void {
            let address = _memManager.getNextTwoBytes();
            this.Xreg = parseInt((_memManager.memory[address].byte), 16);
            this.increasePC(3);
        }
        
        public loadYRegWithConst(): void {
           this.Yreg = _memManager.getNextByte();
           this.increasePC(2);
        }
        
        public loadYRegFromMem(): void {
            let address = _memManager.getNextTwoBytes();
            this.Yreg = parseInt((_memManager.memory[address].byte), 16);
            this.increasePC(3);
        }
        
        public noOp(): void {
           //Nothing to see here, just incrementing the program counter
           this.increasePC(1);
        }
        
        public breakProcess(): void {
           this.PC = 0;
           this.Acc = 0;
           this.Xreg = 0;
           this.Yreg = 0;
           this.Zflag = 0;
           this.increasePC(1);
        }
        
        public compareToXReg(): void {
           let address = _memManager.getNextTwoBytes();
           let value = parseInt((_memManager.memory[address].byte), 16);
           if(value == this.Xreg){
               this.Zflag = 1;
           } else {
               this.Zflag = 0;
           }
           this.increasePC(3);
        }
        
        //Branch n bytes if Zflag=0
        public branchNotEqual(): void {
           let jump: number = _memManager.getNextByte();
           this.increasePC(2);
           if(this.Zflag == 0){
               this.increasePC(jump);
           }
        }
        
        public incrByteVal(): void {
           let address = _memManager.getNextTwoBytes();
           let data: string = _memManager.memory[address].byte
           let value: number = parseInt(data, 16);
           value++;
           _memManager.writeByte(address, value.toString(16));
           this.increasePC(3);
        }
        
        public sysCall(): void {
           //TODO: Write code 
        }
        
        
    }
}
