
module TSOS{
    export class memoryManager {
        
        public memSize: Number = 768;
        public memory: Byte[];
        public numOfBlocks: number = 3;
        public base: number = 0;
        public memCursor: number = this.base;
        
        constructor() {
            var memry = new Memory();
            this.memory = memry.bytes;
        }
        
        public loadToMemory(code: string):void {
            for (var i = 0; i < code.length; i += 2) {
                var toByte = code.charAt(i) + code.charAt(i+1);
                
                this.memory[this.memCursor] = new Byte(toByte);
                this.memCursor++;
            }
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
    
    }
}