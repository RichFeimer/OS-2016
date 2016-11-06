///<reference path="../globals.ts" />

module TSOS {

export class memoryManager {
        
        public memSize: number = 768;
        public memory = new Memory(this.memSize).bytes;
        public numOfBlocks: number = 3;
        public base: number = 0;
        public limit: number = 255;
        public counter: number = 0;
        public memCursor: number = this.base;
        
        constructor() {
        //    var memry = new Memory(this.memSize);
        //    this.memory = memry.bytes;
            
        }
        
        
        public test(code: string):void{
            _StdOut.putText(code);
        }
        
        public loadToMemory(code: string):void {
            for (var i = 0; i < code.length; i += 2) {
                var toByte = code.charAt(i) + code.charAt(i+1);
                
                this.memory[this.memCursor] = new Byte(toByte);
                this.memCursor++;
                Control.updateMemoryTable();
            }
            
            _process = new pcb();
            _process.init(_pid, this.base, this.limit, this.counter);
            _StdOut.putText("Load sucessful. PID = " + _process.pid);
        }
        
        public getNextByte(): number{
            return parseInt(((this.memory[_CPU.PC + 1]).toString()),16);
        }
        
        public getNextTwoBytes(): number{
            return parseInt(((this.memory[_CPU.PC + 2]).toString()) + ((this.memory[_CPU.PC + 1]).toString()),16);
        }
        
        public writeByte (loc: number, byte: string) {
            if(byte.length < 2) {
                byte = "0" + byte;
            }
            this.memory[loc] = new Byte(byte);
        }
        
        public readByte (loc: number):Byte{
            return this.memory[loc];
        }
    
    }
}