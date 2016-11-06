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
        memoryManager.prototype.test = function (code) {
            _StdOut.putText(code);
        };
        memoryManager.prototype.loadToMemory = function (code) {
            for (var i = 0; i < code.length; i += 2) {
                var toByte = code.charAt(i) + code.charAt(i + 1);
                this.memory[this.memCursor] = new TSOS.Byte(toByte);
                this.memCursor++;
                TSOS.Control.updateMemoryTable();
            }
            _process = new TSOS.pcb();
            _process.init(_pid, this.base, this.limit, this.counter);
            _StdOut.putText("Load sucessful. PID = " + _process.pid);
        };
        memoryManager.prototype.getNextByte = function () {
            return parseInt(((this.memory[_CPU.PC + 1]).toString()), 16);
        };
        memoryManager.prototype.getNextTwoBytes = function () {
            return parseInt(((this.memory[_CPU.PC + 2]).toString()) + ((this.memory[_CPU.PC + 1]).toString()), 16);
        };
        memoryManager.prototype.writeByte = function (loc, byte) {
            if (byte.length < 2) {
                byte = "0" + byte;
            }
            this.memory[loc] = new TSOS.Byte(byte);
        };
        memoryManager.prototype.readByte = function (loc) {
            return this.memory[loc];
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
