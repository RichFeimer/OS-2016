var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.bytes = [];
            for (var i = 0; i < size; i++) {
                this.bytes[i] = new Byte("00");
            }
        }
        return Memory;
    }());
    TSOS.Memory = Memory;
    var Byte = (function () {
        function Byte(hex) {
            this.hex = hex;
        }
        return Byte;
    }());
    TSOS.Byte = Byte;
})(TSOS || (TSOS = {}));
