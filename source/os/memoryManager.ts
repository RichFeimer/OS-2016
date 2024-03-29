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
       
        
        public loadToMemory(code: string, priority: number):void {
          if((code.length/2) <= 256){
            if(this.limit > 767){
                //If there's no room in memory, load to disk
                _process = new pcb();
                _process.init(_pid, 0,0,0, priority, "disk");
                _residentList.push(_process);
                fileSystemDeviceDriver.createFile("process" + _process.pid.toString());
                fileSystemDeviceDriver.writeFile("process" + _process.pid.toString(), code);
                Control.updateDiskTable();
                _pid++;
                _StdOut.putText("Program successfully loaded to disk");
                _StdOut.advanceLine();
            }else{
                //If room in memory exists, use it
                for (var i = 0; i < code.length; i += 2) {
                    var toByte = code.charAt(i) + code.charAt(i+1);               
                    this.memory[this.memCursor] = new Byte(toByte);
                    this.memCursor++;  
                }
            }
           
            
            _process = new pcb();
            _process.init(_pid, this.base, this.limit, this.counter, priority, "memory");
            _StdOut.putText("Load sucessful. PID = " + _process.pid);
            _residentList.push(_process);
            _pid++;
            
            
            Control.updateMemoryTable();
            
            this.counter = this.limit + 1;
            this.base = this.limit + 1;
            this.limit = this.limit + 256;
            this.memCursor = this.base;
          }else{
              _StdOut.putText("Error: Memory out of bounds. Program is tooo long");
          }
        }
        
        //Tactically nuke a single segment of the memory
        public clearMemSeg(base: number, limit: number):void{
            for(var i = base; i < limit; i++){
                this.memory[i] = new Byte("00");
            }
            Control.updateMemoryTable();
        }
        
        //Just nuke the whole damn thing
        public clearMemory():void{
            for (var i = 0; i < this.memory.length; i++) {
               this.memory[i] = new Byte("00");
            }
            Control.updateMemoryTable();
        }
        
        public getCodeFromMem(base:number, limit:number):string{
            let hexString = "";
            for(let i = base; i<limit; i++){
                hexString += this.memory[i].byte;
            }
            return hexString;
        }
        
        
        public getNextByte(): number{
            return parseInt((this.memory[_CPU.PC + 1].byte),16);
        }
        
        public getNextTwoBytes(): number{
            return parseInt(((this.memory[_CPU.PC + 2].byte) + (this.memory[_CPU.PC + 1].byte)),16);
        }
        
        public writeByte (loc: number, byte: string) {
            if(byte.length < 2) {
                byte = "0" + byte;
            }
            this.memory[loc] = new Byte(byte);
        }
        
        public readByte (loc: number):number{
            //_StdOut.putText(this.memory[loc].byte.toString());
            return parseInt(this.memory[loc].byte.toString(),16);
        }
    
    }
}