///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var cpuScheduler = (function () {
        function cpuScheduler() {
        }
        cpuScheduler.beginExecution = function () {
            _currentProcess = _readyQueue.dequeue();
            _CPU.updateCPU(_currentProcess);
            _currentProcess.state = 1;
            _CPU.isExecuting = true;
        };
        cpuScheduler.swap = function () {
            var nextProcess = _readyQueue.index(0);
            _CPU.updatePCB(_CPU);
            nextProcess.base = _currentProcess.base;
            nextProcess.limit = _currentProcess.limit;
            if (nextProcess.PC > 0 && nextProcess.PC < 256) {
                nextProcess.PC = nextProcess.PC + _currentProcess.base;
            }
            if (nextProcess.PC >= 256 && nextProcess.PC < 511) {
                nextProcess.PC = nextProcess.PC - 256;
            }
            if (nextProcess.PC >= 511 && nextProcess.PC < 768) {
                nextProcess.PC = nextProcess.PC - 256;
            }
            _Kernel.krnTrace("BASE = " + nextProcess.base + " LIMIT = " + nextProcess.limit + " PC =" + nextProcess.PC);
        };
        return cpuScheduler;
    }());
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
