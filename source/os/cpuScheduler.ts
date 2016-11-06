
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
    }
}