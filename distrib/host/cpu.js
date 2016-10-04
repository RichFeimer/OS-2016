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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.memSize = 768;
            var memry = new TSOS.Memory(this.memSize);
            this.memory = memry.bytes;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        Cpu.prototype.execute = function (instr) {
            switch (instr) {
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
        };
        Cpu.prototype.increasePC = function (bytes) {
            this.PC = (this.PC + bytes);
        };
        Cpu.prototype.loadAccWithConst = function () {
            this.Acc = this.getNextByte();
            this.increasePC(2);
        };
        Cpu.prototype.loadAccFromMem = function () {
            this.Acc = this.getNextTwoBytes();
            this.increasePC(3);
        };
        Cpu.prototype.storeAccInMem = function () {
            var address = this.getNextTwoBytes();
            this.writeByte(address, this.Acc.toString());
            this.increasePC(3);
        };
        Cpu.prototype.addWithCarry = function () {
            //TODO: Write code 
        };
        Cpu.prototype.loadXRegWithConst = function () {
            //TODO: Write code 
        };
        Cpu.prototype.loadXRegFromMem = function () {
            //TODO: Write code 
        };
        Cpu.prototype.loadYRegWithConst = function () {
            //TODO: Write code 
        };
        Cpu.prototype.loadYRegFromMem = function () {
            //TODO: Write code 
        };
        Cpu.prototype.noOp = function () {
            //Nothing to see here, just incrementing the program counter
            this.increasePC(1);
        };
        Cpu.prototype.breakProcess = function () {
            //TODO: Write code 
        };
        Cpu.prototype.compareToXReg = function () {
            //TODO: Write code 
        };
        Cpu.prototype.branchNotEqual = function () {
            //TODO: Write code 
        };
        Cpu.prototype.incrByteVal = function () {
            //TODO: Write code 
        };
        Cpu.prototype.sysCall = function () {
            //TODO: Write code 
        };
        Cpu.prototype.getNextByte = function () {
            return parseInt(((this.memory[this.PC + 1]).toString()), 16);
        };
        Cpu.prototype.getNextTwoBytes = function () {
            return parseInt(((this.memory[this.PC + 2]).toString()) + ((this.memory[this.PC + 1]).toString()), 16);
        };
        Cpu.prototype.writeByte = function (loc, byte) {
            if (byte.length < 2) {
                byte = "0" + byte;
            }
            this.memory[loc] = new TSOS.Byte(byte);
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
