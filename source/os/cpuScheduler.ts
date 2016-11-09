///<reference path="../globals.ts" />
module TSOS{

    export class cpuScheduler{
        
        constructor(){
            
        }
        
         static beginExecution():void {
            _currentProcess = _readyQueue.dequeue();
            _CPU.updateCPU(_currentProcess);
            _currentProcess.state = 1;
            _CPU.isExecuting = true;
        }
        
        
        public static swap():void{
            let nextProcess = _readyQueue.index(0);
            _CPU.updatePCB(_CPU);
            
            nextProcess.base = _currentProcess.base;
            nextProcess.limit = _currentProcess.limit;
            if(nextProcess.PC > 0 && nextProcess.PC < 256){
                nextProcess.PC = nextProcess.PC + _currentProcess.base;
            }
            if(nextProcess.PC >= 256 && nextProcess.PC < 511){
                nextProcess.PC = nextProcess.PC - 256;
            }
            if(nextProcess.PC >= 511 && nextProcess.PC < 768){
                nextProcess.PC = nextProcess.PC - 256;
            }
            
            _Kernel.krnTrace("BASE = " + nextProcess.base + " LIMIT = " + nextProcess.limit + " PC =" + nextProcess.PC);
            
        }
    }
}