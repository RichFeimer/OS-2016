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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, IR, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (IR === void 0) { IR = "00"; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.updateCPU = function (currentProcess) {
            this.PC = currentProcess.PC;
            this.Acc = currentProcess.Acc;
            this.Xreg = currentProcess.Xreg;
            this.Yreg = currentProcess.Yreg;
            this.Zflag = currentProcess.Zflag;
        };
        Cpu.prototype.updatePCB = function (CPU) {
            _currentProcess.PC = this.PC;
            _currentProcess.Acc = this.Acc;
            _currentProcess.Xreg = this.Xreg;
            _currentProcess.Yreg = this.Yreg;
            _currentProcess.Zflag = this.Zflag;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {
                var opcode = _memManager.readByte(this.PC);
                //_StdOut.putText("opcode = " + opcode);
                this.execute(opcode.toString(16));
                TSOS.Control.updateCpuTable();
                TSOS.Control.updatePcbTable();
            }
        };
        Cpu.prototype.execute = function (instr) {
            instr = instr.toLowerCase();
            this.IR = instr;
            //_StdOut.putText(instr);
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
        Cpu.prototype.increasePC = function (numBytes) {
            this.PC = (this.PC + numBytes);
        };
        Cpu.prototype.loadAccWithConst = function () {
            this.Acc = _memManager.getNextByte();
            this.increasePC(2);
            _Kernel.krnTrace("Const ACC = " + this.Acc);
        };
        Cpu.prototype.loadAccFromMem = function () {
            this.Acc = _memManager.getNextTwoBytes();
            this.increasePC(3);
            _Kernel.krnTrace("Mem ACC = " + this.Acc);
        };
        Cpu.prototype.storeAccInMem = function () {
            var address = _memManager.getNextTwoBytes();
            if (address + _currentProcess.base <= _currentProcess.limit) {
                _memManager.writeByte(address, this.Acc.toString(16));
                this.increasePC(3);
                _Kernel.krnTrace("ACC Stored");
                TSOS.Control.updateMemoryTable();
            }
            else {
                _StdOut.putText("Error: Memory breached.");
            }
        };
        Cpu.prototype.addWithCarry = function () {
            var address = _memManager.getNextTwoBytes();
            var sum = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16) + this.Acc;
            this.Acc = sum;
            this.increasePC(3);
        };
        Cpu.prototype.loadXRegWithConst = function () {
            this.Xreg = _memManager.getNextByte();
            this.increasePC(2);
        };
        Cpu.prototype.loadXRegFromMem = function () {
            var address = _memManager.getNextTwoBytes();
            this.Xreg = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16);
            this.increasePC(3);
        };
        Cpu.prototype.loadYRegWithConst = function () {
            this.Yreg = _memManager.getNextByte();
            this.increasePC(2);
        };
        Cpu.prototype.loadYRegFromMem = function () {
            var address = _memManager.getNextTwoBytes();
            this.Yreg = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16);
            this.increasePC(3);
        };
        Cpu.prototype.noOp = function () {
            //Nothing to see here, just incrementing the program counter
            this.increasePC(1);
        };
        Cpu.prototype.breakProcess = function () {
            //this.PC = 0;
            //this.Acc = 0;
            //this.Xreg = 0;
            //this.Yreg = 0;
            //this.Zflag = 0;
            //this.increasePC(1);
            this.updatePCB(_CPU);
            this.isExecuting = false;
            _Kernel.krnTrace("BREAK");
        };
        Cpu.prototype.compareToXReg = function () {
            var address = _memManager.getNextTwoBytes();
            var value = parseInt((_memManager.memory[address + _currentProcess.base].byte), 16);
            if (value == this.Xreg) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
            this.increasePC(3);
        };
        //Branch n bytes if Zflag=0
        Cpu.prototype.branchNotEqual = function () {
            var jump = _memManager.getNextByte();
            this.increasePC(1);
            if (this.Zflag == 0) {
                var offset = this.PC + jump;
                if (offset > _currentProcess.limit) {
                    this.PC = offset - 255;
                }
                else {
                    this.PC = offset + 1;
                }
            }
            else {
                this.increasePC(1);
            }
        };
        Cpu.prototype.incrByteVal = function () {
            var address = _memManager.getNextTwoBytes();
            var data = _memManager.memory[address + _currentProcess.base].byte;
            var value = parseInt(data, 16);
            value++;
            _memManager.writeByte(address, value.toString(16));
            this.increasePC(3);
        };
        Cpu.prototype.sysCall = function () {
            if (this.Xreg == 1) {
                _Kernel.krnTrace("printing " + this.Yreg.toString());
                _StdOut.putText(this.Yreg.toString());
                this.increasePC(1);
            }
            if (this.Xreg == 2) {
                var posit = this.Yreg + _currentProcess.base;
                while (_memManager.memory[posit].byte != "00") {
                    var ascii = String.fromCharCode(parseInt(_memManager.memory[posit].byte, 16));
                    _StdOut.putText(ascii);
                    posit++;
                }
                this.increasePC(1);
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
