///<reference path="../globals.ts" />
module TSOS{

    export class cpuScheduler{
        
        constructor()
        {}
        
        public beginExecution():void{
            _currentProcess = _readyQueue.dequeue();
            _CPU.updateCPU(_currentProcess);
            _currentProcess.state = 1;
            _CPU.isExecuting = true;
            
        }
        
        public contextSwitch():void {
            if (_qCount == _quantum){
                _qCount = 0;
                
                if(_readyQueue.getSize() > 0) {
                    _currentProcess.state = 0;
                    _CPU.updatePCB(_CPU);
                    _readyQueue.enqueue(_currentProcess);
                    _currentProcess = _readyQueue.dequeue();
                    _currentProcess.state = 1;
                    _CPU.updateCPU(_currentProcess);
                }
            }
        }
        
        public contextSwitchBreak():void {
            _qCount = 0;
            if (_readyQueue.getSize() > 0) {
                _CPU.isExecuting = true;
                _CPU.updatePCB(_CPU);
                _currentProcess.state = 2;
                _currentProcess = _readyQueue.dequeue();
                _CPU.updateCPU(_currentProcess);
            }else{
                _CPU.isExecuting = false;
                _StdOut.advanceLine();
                _StdOut.putText("Finished Execution");
                
            }
        }
    }
}