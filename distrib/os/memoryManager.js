var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
            this.memSize = 768;
            this.numOfBlocks = 3;
            this.base = 0;
            this.memCursor = this.base;
            var memry = new TSOS.Memory();
            this.memory = memry.bytes;
        }
        memoryManager.prototype.loadToMemory = function (code) {
            for (var i = 0; i < code.length; i += 2) {
                var toByte = code.charAt(i) + code.charAt(i + 1);
                this.memory[this.memCursor] = new TSOS.Byte(toByte);
                this.memCursor++;
            }
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
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
