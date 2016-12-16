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
        //Here we go...
        cpuScheduler.prototype.swap = function (fNameIn, pids) {
            var nextProcess = _readyQueue.getProcess(0);
            _CPU.updatePCB(_CPU);
            if (_schedule == "rr") {
                nextProcess.location == "memory";
                nextProcess.base = _currentProcess.base;
                nextProcess.limit = _currentProcess.limit;
                if (nextProcess.PC > 0) {
                    _Kernel.krnTrace("PC AFTER PROCESS CAME FROM DISK " + nextProcess.PC);
                    if (nextProcess.PC > 0 && nextProcess.PC < 256) {
                        _Kernel.krnTrace("DISK PROCESS WAS IN FIRST SEGMENT");
                        nextProcess.PC = nextProcess.PC + _currentProcess.base;
                    }
                    if (nextProcess.PC >= 256 && nextProcess.PC < 511) {
                        _Kernel.krnTrace("DISK PROCESS WAS IN SECOND SEGMENT");
                        nextProcess.PC = (nextProcess.PC) - 256;
                    }
                    if (nextProcess.PC >= 511 && nextProcess.PC < 768) {
                        _Kernel.krnTrace("DISK PROCESS WAS IN THIRD SEGMENT");
                        nextProcess.PC = (nextProcess.PC) - 256;
                    }
                }
                else {
                    nextProcess.PC = _currentProcess.base;
                }
                TSOS.fileSystemDeviceDriver.createFile("process" + _currentProcess.pid.toString());
                _Kernel.krnTrace("CREATING FILE PROCESS" + _currentProcess.pid.toString() + "WITH PC " + _currentProcess.PC.toString());
                TSOS.fileSystemDeviceDriver.writeFile("process" + _currentProcess.pid.toString(), _memManager.getCodeFromMem(_currentProcess.base, _currentProcess.limit));
                _currentProcess.location = "disk";
                if (nextProcess != undefined) {
                    var hex = TSOS.fileSystemDeviceDriver.readChain("process" + nextProcess.pid.toString());
                    var hexStart = 0;
                    var hexEnd = 1;
                    var counter = nextProcess.base;
                    _memManager.clearMemSeg(counter, nextProcess.limit);
                    for (var i = counter; i < nextProcess.limit; i++) {
                        var codes = hex.charAt(hexStart) + hex.charAt(hexEnd);
                        if (codes == "") {
                            _memManager.memory[i] = new TSOS.Byte("00");
                            hexStart += 2;
                            hexEnd += 2;
                        }
                        else {
                            _memManager.memory[i] = new TSOS.Byte(codes);
                            hexStart += 2;
                            hexEnd += 2;
                        }
                    }
                    _readyQueue.enqueue(_currentProcess);
                    TSOS.fileSystemDeviceDriver.deleteFile("process" + nextProcess.pid.toString());
                    _currentProcess = _readyQueue.dequeue();
                    TSOS.Control.updateDiskTable();
                    _CPU.updateCPU(_currentProcess);
                    _CPU.isExecuting = true;
                }
            }
            else {
                if (nextProcess != undefined) {
                    nextProcess.location == "memory";
                    nextProcess.base = _currentProcess.base;
                    nextProcess.limit = _currentProcess.limit;
                    nextProcess.PC = _currentProcess.base;
                    var hex = TSOS.fileSystemDeviceDriver.readChain("process" + nextProcess.pid.toString());
                    var hexStart = 0;
                    var hexEnd = 1;
                    var counter = nextProcess.base;
                    _memManager.clearMemSeg(counter, nextProcess.limit);
                    for (var i_1 = counter; i_1 < nextProcess.limit; i_1++) {
                        var codes_1 = hex.charAt(hexStart) + hex.charAt(hexEnd);
                        if (codes_1 == "") {
                            _memManager.memory[i_1] = new TSOS.Byte("00");
                            hexStart += 2;
                            hexEnd += 2;
                        }
                        else {
                            _memManager.memory[i_1] = new TSOS.Byte(codes_1);
                            hexStart += 2;
                            hexEnd += 2;
                        }
                    }
                    _currentProcess = _readyQueue.dequeue();
                    TSOS.fileSystemDeviceDriver.deleteFile("process" + nextProcess.pid.toString());
                    TSOS.Control.updateDiskTable();
                    _CPU.updateCPU(_currentProcess);
                    _CPU.isExecuting = true;
                }
            }
        };
        //Use merge sort for priority
        cpuScheduler.prototype.mergeSort = function (leftArr, rightArr) {
            var concat = [];
            while (leftArr.length > 0 && rightArr.length > 0) {
                if (leftArr[0].priority < rightArr[0].priority) {
                    concat.push(leftArr.shift());
                }
                else if (leftArr[0].priority == rightArr[0].priority) {
                    concat.push(leftArr.shift());
                }
                else {
                    concat.push(rightArr.shift());
                }
            }
            concat = concat.concat(leftArr).concat(rightArr);
            //make certain the remaining arrays are empty
            leftArr.splice(0, leftArr.length);
            rightArr.splice(0, rightArr.length);
            return concat;
        };
        cpuScheduler.prototype.orderResList = function (rList) {
            // Terminal condition - don't need to do anything for arrays with 0 or 1 items
            if (rList.length < 2) {
                return rList;
            }
            var sortedRList = [];
            var i;
            var len;
            for (i = 0, len = rList.length; i < len; i++) {
                sortedRList.push([rList[i]]);
            }
            sortedRList.push([]); //in case of odd number of items
            for (var lim = len; lim > 1; lim = Math.floor((lim + 1) / 2)) {
                for (var a = 0, b = 0; b < lim; a++, b += 2) {
                    sortedRList[a] = this.mergeSort(sortedRList[b], sortedRList[b + 1]);
                }
                sortedRList[a] = []; //in case of odd number of items
            }
            return sortedRList[0];
        };
        cpuScheduler.runOneDiskProcess = function (fileName, pid) {
            if (_currentProcess == undefined) {
                _residentList[0].location = "disk";
                TSOS.fileSystemDeviceDriver.createFile("process" + _residentList[0].pid.toString());
                TSOS.fileSystemDeviceDriver.writeFile("process" + _residentList[0].pid.toString(), _memManager.getCodeFromMem(_residentList[0].base, _residentList[0].limit));
                TSOS.Control.updateDiskTable();
                _residentList[pid].base = 0;
                _residentList[pid].limit = 255;
                _residentList[pid].PC = 0;
                _residentList[pid].location = "memory";
            }
            else {
                _currentProcess.base = 0;
                _currentProcess.limit = 255;
                _currentProcess.PC = 0;
                _currentProcess.location = "memory";
                _residentList[pid].base = _currentProcess.base;
                _residentList[pid].limit = _currentProcess.limit;
                _residentList[pid].PC = _currentProcess.PC;
                _residentList[pid].location = "memory";
                _CPU.updateCPU(_currentProcess);
            }
            var hex = TSOS.fileSystemDeviceDriver.readChain(fileName);
            var hexStart = 0;
            var hexEnd = 1;
            var counter = _residentList[pid].base;
            _memManager.clearMemSeg(counter, _residentList[pid].limit);
            for (var i = counter; i < _residentList[pid].limit; i++) {
                var codes = hex.charAt(hexStart) + hex.charAt(hexEnd);
                if (codes == "") {
                    _memManager.memory[i] = new TSOS.Byte("00");
                    hexStart += 2;
                    hexEnd += 2;
                }
                else {
                    _memManager.memory[i] = new TSOS.Byte(codes);
                    hexStart += 2;
                    hexEnd += 2;
                }
            }
            _currentProcess = _residentList[pid];
            TSOS.fileSystemDeviceDriver.deleteFile(fileName);
            TSOS.Control.updateDiskTable();
            _CPU.isExecuting = true;
        };
        cpuScheduler.prototype.contextSwitch = function () {
            if (_qCount == _quantum) {
                _qCount = 0;
                if (_readyQueue.getSize() > 0) {
                    var nextProcess = _readyQueue.getProcess(0);
                    if (nextProcess != undefined && nextProcess.location == "disk") {
                        this.swap("", 0);
                    }
                    else {
                        //state: 0 means not executing, 1 means executing
                        _currentProcess.state = 0;
                        _CPU.updatePCB(_CPU);
                        _readyQueue.enqueue(_currentProcess);
                        _currentProcess = _readyQueue.dequeue();
                        _currentProcess.state = 1;
                        _CPU.updateCPU(_currentProcess);
                    }
                }
            }
        };
        cpuScheduler.prototype.contextSwitchBreak = function () {
            _qCount = 0;
            if (_readyQueue.getSize() > 0) {
                var nextProcess = _readyQueue.getProcess(0);
                if (nextProcess != undefined && nextProcess.location == "disk") {
                    this.swap("", 0);
                }
                else {
                    _CPU.isExecuting = true;
                    _CPU.updatePCB(_CPU);
                    _currentProcess.state = 2;
                    _currentProcess = _readyQueue.dequeue();
                    _CPU.updateCPU(_currentProcess);
                }
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
