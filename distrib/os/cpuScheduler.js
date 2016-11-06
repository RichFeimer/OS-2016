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
        return cpuScheduler;
    }());
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
