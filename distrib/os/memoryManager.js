///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
            //    var memry = new Memory(this.memSize);
            //    this.memory = memry.bytes;
            this.memSize = 768;
            this.memory = new TSOS.Memory(this.memSize).bytes;
            this.numOfBlocks = 3;
            this.base = 0;
            this.limit = 255;
            this.counter = 0;
            this.memCursor = this.base;
        }
        memoryManager.prototype.loadToMemory = function (code, priority) {
            if ((code.length / 2) <= 256) {
                if (this.limit > 767) {
                    //If there's no room in memory, load to disk
                    _process = new TSOS.pcb();
                    _process.init(_pid, 0, 0, 0, priority, "disk");
                    _residentList.push(_process);
                    TSOS.fileSystemDeviceDriver.createFile("process" + _process.pid.toString());
                    TSOS.fileSystemDeviceDriver.writeFile("process" + _process.pid.toString(), code);
                    TSOS.Control.updateDiskTable();
                    _pid++;
                    _StdOut.putText("Program successfully loaded to disk");
                    _StdOut.advanceLine();
                }
                else {
                    //If room in memory exists, use it
                    for (var i = 0; i < code.length; i += 2) {
                        var toByte = code.charAt(i) + code.charAt(i + 1);
                        this.memory[this.memCursor] = new TSOS.Byte(toByte);
                        this.memCursor++;
                    }
                }
                _process = new TSOS.pcb();
                _process.init(_pid, this.base, this.limit, this.counter, priority, "memory");
                _StdOut.putText("Load sucessful. PID = " + _process.pid);
                _residentList.push(_process);
                _pid++;
                TSOS.Control.updateMemoryTable();
                this.counter = this.limit + 1;
                this.base = this.limit + 1;
                this.limit = this.limit + 256;
                this.memCursor = this.base;
            }
            else {
                _StdOut.putText("Error: Memory out of bounds. Program is tooo long");
            }
        };
        //Tactically nuke a single segment of the memory
        memoryManager.prototype.clearMemSeg = function (base, limit) {
            for (var i = base; i < limit; i++) {
                this.memory[i] = new TSOS.Byte("00");
            }
            TSOS.Control.updateMemoryTable();
        };
        //Just nuke the whole damn thing
        memoryManager.prototype.clearMemory = function () {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = new TSOS.Byte("00");
            }
            TSOS.Control.updateMemoryTable();
        };
        memoryManager.prototype.getCodeFromMem = function (base, limit) {
            var hexString = "";
            for (var i = base; i < limit; i++) {
                hexString += this.memory[i].byte;
            }
            return hexString;
        };
        memoryManager.prototype.getNextByte = function () {
            return parseInt((this.memory[_CPU.PC + 1].byte), 16);
        };
        memoryManager.prototype.getNextTwoBytes = function () {
            return parseInt(((this.memory[_CPU.PC + 2].byte) + (this.memory[_CPU.PC + 1].byte)), 16);
        };
        memoryManager.prototype.writeByte = function (loc, byte) {
            if (byte.length < 2) {
                byte = "0" + byte;
            }
            this.memory[loc] = new TSOS.Byte(byte);
        };
        memoryManager.prototype.readByte = function (loc) {
            //_StdOut.putText(this.memory[loc].byte.toString());
            return parseInt(this.memory[loc].byte.toString(), 16);
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
