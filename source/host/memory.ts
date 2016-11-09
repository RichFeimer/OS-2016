///<reference path="../globals.ts" />

module TSOS {
    
    
    export class Byte {
        public byte: string;
        constructor(hex: string) {
            this.byte = hex;
        }
    }
    
    export class Memory {
    public bytes: Byte[] = [];
        constructor(public size: number) {}
            public init():void {
            //initialize the array
            for (var i = 0; i < this.size; i++) {
               this.bytes[i] = new Byte("00");
            }
            
        }
        
        
    }
    
}