var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.bytes = [];
            //initialize the array
            for (var i = 0; i < 768; i++) {
                this.bytes[i] = new Byte("00");
            }
        }
        return Memory;
    }());
    TSOS.Memory = Memory;
    var Byte = (function () {
        function Byte(hex) {
            this.byte = hex;
        }
        return Byte;
    }());
    TSOS.Byte = Byte;
})(TSOS || (TSOS = {}));
