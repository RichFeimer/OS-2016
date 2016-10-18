
module TSOS {
    export class Memory {
    public bytes: Byte[] = [];
        constructor() {
            //initialize the array
            for (var i = 0; i < 768; i++) {
               this.bytes[i] = new Byte("00");
            }
        }
    }
    
    export class Byte {
        public byte: string;
        constructor(hex: string) {
            this.byte = hex;
        }
    }
}