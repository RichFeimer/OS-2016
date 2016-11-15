///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var cpuScheduler = (function () {
        function cpuScheduler() {
        }
        cpuScheduler.prototype.beginExecution = function () {
            _currentProcess = _readyQueue.dequeue();
            _CPU.updateCPU(_currentProcess);
            _currentProcess.state = 1;
            _CPU.isExecuting = true;
        };
        cpuScheduler.prototype.contextSwitch = function () {
            if (_qCount == _quantum) {
                _qCount = 0;
                if (_readyQueue.getSize() > 0) {
                    _currentProcess.state = 0;
                    _CPU.updatePCB(_CPU);
                    _readyQueue.enqueue(_currentProcess);
                    _currentProcess = _readyQueue.dequeue();
                    _currentProcess.state = 1;
                    _CPU.updateCPU(_currentProcess);
                }
            }
        };
        cpuScheduler.prototype.contextSwitchBreak = function () {
            _qCount = 0;
            if (_readyQueue.getSize() > 0) {
                _CPU.isExecuting = true;
                _CPU.updatePCB(_CPU);
                _currentProcess.state = 2;
                _currentProcess = _readyQueue.dequeue();
                _CPU.updateCPU(_currentProcess);
            }
            else {
                _CPU.isExecuting = false;
                _StdOut.advanceLine();
                _StdOut.putText("Finished Execution");
            }
        };
        return cpuScheduler;
    }());
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
