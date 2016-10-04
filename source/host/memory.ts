
module TSOS {
    export class Memory {
    public bytes: Byte[] = [];
        constructor(size: Number) {
            for (var i = 0; i < size; i++) {
               this.bytes[i] = new Byte("00");
            }
        }
    }
    
    export class Byte {
        public byte: string;
        constructor(public hex: string) {
        }
    }
}