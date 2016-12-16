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
                    public IR: string = "00",
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
        
        public updatePCB(CPU: Cpu):void{
            _currentProcess.PC = this.PC;
            _currentProcess.Acc = this.Acc;
            _currentProcess.Xreg = this.Xreg;
            _currentProcess.Yreg = this.Yreg;
            _currentProcess.Zflag = this.Zflag;
        }
        
        public stop() {
            this.init();
        }
        
        public start(process: pcb){
            _currentProcess = process;
            this.PC = process.PC;
            this.Acc = process.Acc;
            this.Xreg = process.Xreg;
            this.Yreg = process.Yreg;
            this.Zflag = process.Zflag;
            this.isExecuting = true;
        }

        
        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if(this.isExecuting){
                let opcode = _memManager.readByte(this.PC);
                //_StdOut.putText("opcode = " + opcode);
                this.execute(opcode.toString(16));
                Control.updateCpuTable();
                Control.updatePcbTable();
            }
        }
        
        public execute(instr : string) : void {
            instr = instr.toLowerCase();
            this.IR = instr;
            //_StdOut.putText(instr);
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
        
        public increasePC(numBytes): void {
            this.PC = (this.PC + numBytes)
        }
        //A9
        public loadAccWithConst(): void {
           this.Acc = _memManager.getNextByte();
           this.increasePC(2);
           _Kernel.krnTrace("Const ACC = " + this.Acc);
        }
        //AD
        public loadAccFromMem(): void {
           this.Acc = _memManager.getNextTwoBytes();
           this.increasePC(3);
           _Kernel.krnTrace("Mem ACC = " + this.Acc);
        }
        //8D
        public storeAccInMem(): void {
           let address = _memManager.getNextTwoBytes();
           if(address + _currentProcess.base <= _currentProcess.limit){
               _memManager.writeByte(address + _currentProcess.base, this.Acc.toString(16));
               this.increasePC(3);
               _Kernel.krnTrace("ACC Stored");
               Control.updateMemoryTable();
           }else{
               _StdOut.putText("Error: Memory breached.");
               _StdOut.advanceLine();
               //TODO: Kill process
           } 
            _Kernel.krnTrace("STORED ACC VAL IS " + this.Acc);
        }
        //6D
        public addWithCarry(): void {
            let address = _memManager.getNextTwoBytes();
            let sum: number = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16) + this.Acc;
            this.Acc = sum;
            this.increasePC(3);
            _Kernel.krnTrace("ADDED CARRY ACC VAL IS " + this.Acc);
        }
        //A2
        public loadXRegWithConst(): void {
           this.Xreg = _memManager.getNextByte();
           this.increasePC(2);
           _Kernel.krnTrace("X REG FROM CONST IS " + this.Xreg);
        }
        //AE
        public loadXRegFromMem(): void {
            let address = _memManager.getNextTwoBytes();
            this.Xreg = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16);
            this.increasePC(3);
            _Kernel.krnTrace("X REG FROM MEM IS " + this.Xreg);
        }
        //A0
        public loadYRegWithConst(): void {
           this.Yreg = _memManager.getNextByte();
           this.increasePC(2);
        }
        //AC
        public loadYRegFromMem(): void {
            let address = _memManager.getNextTwoBytes();
            this.Yreg = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16);
            this.increasePC(3);
            _Kernel.krnTrace("YREG FROM MEM IS " + this.Yreg);
        }
        
        public noOp(): void {
           //Nothing to see here, just incrementing the program counter
           this.increasePC(1);
        }
        
        public breakProcess(): void {
           //this.PC = 0;
           //this.Acc = 0;
           //this.Xreg = 0;
           //this.Yreg = 0;
           //this.Zflag = 0;
           //this.increasePC(1);
           this.updatePCB(_CPU);
           this.isExecuting = false;
           _cpuSched.contextSwitchBreak();
           _Kernel.krnTrace("BREAK");
        }
        
        public compareToXReg(): void {
           let address = _memManager.getNextTwoBytes();
           let value = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16);
           if(value == this.Xreg){
               this.Zflag = 1;
           } else {
               this.Zflag = 0;
           }
           this.increasePC(3);
        }
        //D0
        //Branch n bytes if Zflag=0
        public branchNotEqual(): void {
           let jump: number = _memManager.getNextByte();
           this.increasePC(1);
           if(this.Zflag == 0){
               let offset = this.PC + jump
               if(offset > _currentProcess.limit){
                   this.PC = offset - 255;
               }else{
               this.PC = offset + 1
                }
           }else{
               this.increasePC(1);
           }
        }
        //EE
        public incrByteVal(): void {
           let address = _memManager.getNextTwoBytes();
           let data: string = _memManager.memory[address + _currentProcess.base].byte
           let value: number = parseInt(data, 16);
           value++;
           _memManager.writeByte(address + _currentProcess.base, value.toString(16));
           this.increasePC(3);
        }
        //FF
        public sysCall(): void {
           if(this.Xreg == 1){
               _Kernel.krnTrace("printing " + this.Yreg.toString());
               _StdOut.putText(this.Yreg.toString());
               this.increasePC(1);
           }
           
           if(this.Xreg == 2) {
               let posit = this.Yreg + _currentProcess.base;
               while(_memManager.memory[posit].byte != "00"){
                   let ascii = String.fromCharCode(parseInt(_memManager.memory[posit].byte,16));
                   _StdOut.putText(ascii);
                   posit++;
               }
               this.increasePC(1);
           }
        }
        
         
        
        
    }
}
