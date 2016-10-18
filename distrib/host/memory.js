var TSOS;
(function (TSOS) {
    var Byte = (function () {
        function Byte(hex) {
        }
        return Byte;
    }());
    TSOS.Byte = Byte;
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
})(TSOS || (TSOS = {}));
