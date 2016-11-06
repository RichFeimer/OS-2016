///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Byte = (function () {
        function Byte(hex) {
            this.byte = hex;
        }
        return Byte;
    }());
    TSOS.Byte = Byte;
    var Memory = (function () {
        function Memory(size) {
            this.size = size;
            this.bytes = [];
        }
        Memory.prototype.init = function () {
            //initialize the array
            for (var i = 0; i < this.size; i++) {
                this.bytes[i] = new Byte("00");
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
