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
        
        //Here we go...
        public swap(fNameIn:string, pids: number):void{
            let nextProcess = _readyQueue.getProcess(0);
            _CPU.updatePCB(_CPU);
            
            if(_schedule == "rr"){
                nextProcess.location == "memory";
                nextProcess.base = _currentProcess.base;
                nextProcess.limit = _currentProcess.limit;
                if(nextProcess.PC > 0){
                    _Kernel.krnTrace("PC AFTER PROCESS CAME FROM DISK " +  nextProcess.PC);
                    if(nextProcess.PC > 0 && nextProcess.PC < 256 ){
                        _Kernel.krnTrace("DISK PROCESS WAS IN FIRST SEGMENT");
                        nextProcess.PC = nextProcess.PC + _currentProcess.base;
                    }
                    if(nextProcess.PC >= 256 && nextProcess.PC < 511 ){
                        _Kernel.krnTrace("DISK PROCESS WAS IN SECOND SEGMENT");

                        nextProcess.PC = (nextProcess.PC) -256;
                    }
                    if(nextProcess.PC >= 511 && nextProcess.PC < 768 ){
                        _Kernel.krnTrace("DISK PROCESS WAS IN THIRD SEGMENT");

                        nextProcess.PC = (nextProcess.PC) - 256;
                    }
                }else{
                    nextProcess.PC = _currentProcess.base;
                }
            
            
            fileSystemDeviceDriver.createFile("process"+_currentProcess.pid.toString());
            _Kernel.krnTrace("CREATING FILE PROCESS"+_currentProcess.pid.toString() + "WITH PC " + _currentProcess.PC.toString());
            fileSystemDeviceDriver.writeFile("process"+_currentProcess.pid.toString(), _memManager.getCodeFromMem(_currentProcess.base, _currentProcess.limit));
            _currentProcess.location = "disk";
            
            if(nextProcess!= undefined) {
                let hex = fileSystemDeviceDriver.readChain("process" + nextProcess.pid.toString());
                let hexStart = 0;
                let hexEnd = 1;
                let counter = nextProcess.base;
                _memManager.clearMemSeg(counter, nextProcess.limit);
                for (var i = counter; i < nextProcess.limit; i++) {
                    var codes = hex.charAt(hexStart) + hex.charAt(hexEnd);
                    if (codes == "") {
                        _memManager.memory[i] = new Byte("00");
                        hexStart += 2;
                        hexEnd += 2;
                    }else{
                        _memManager.memory[i] = new Byte(codes);
                        hexStart += 2;
                        hexEnd += 2;
                    }

                }
                
                _readyQueue.enqueue(_currentProcess);
                fileSystemDeviceDriver.deleteFile("process" + nextProcess.pid.toString());
                _currentProcess = _readyQueue.dequeue();

                Control.updateDiskTable();
                _CPU.updateCPU(_currentProcess);
                _CPU.isExecuting = true;
            }
            }else{
                if(nextProcess != undefined) {

                    nextProcess.location == "memory";
                    nextProcess.base = _currentProcess.base;
                    nextProcess.limit = _currentProcess.limit;
                    nextProcess.PC = _currentProcess.base;

                    let hex = fileSystemDeviceDriver.readChain("process" + nextProcess.pid.toString());
                    let hexStart = 0;
                    let hexEnd = 1;
                    let counter = nextProcess.base;
                    _memManager.clearMemSeg(counter, nextProcess.limit);
                    for (let i =counter; i < nextProcess.limit; i++) {

                        let codes = hex.charAt(hexStart) + hex.charAt(hexEnd);
                        if (codes == "") {
                            _memManager.memory[i] = new Byte("00");
                            hexStart += 2;
                            hexEnd += 2;
                        }else{


                            _memManager.memory[i] = new Byte(codes);
                            hexStart += 2;
                            hexEnd += 2;
                        }

                    }
                    _currentProcess = _readyQueue.dequeue();
                    fileSystemDeviceDriver.deleteFile("process" + nextProcess.pid.toString());
                    Control.updateDiskTable();
                    _CPU.updateCPU(_currentProcess);
                    _CPU.isExecuting = true;


                }

            }
        }

        
        //Use merge sort for priority
        public mergeSort(leftArr, rightArr){
            let concat = [];
            while (leftArr.length > 0 && rightArr.length > 0){
                if (leftArr[0].priority < rightArr[0].priority){
                    concat.push(leftArr.shift());
                }
                else if(leftArr[0].priority == rightArr[0].priority){
                    concat.push(leftArr.shift());
                }else {
                    concat.push(rightArr.shift());
                }
            }
            concat = concat.concat(leftArr).concat(rightArr);
            //make certain the remaining arrays are empty
            leftArr.splice(0, leftArr.length);
            rightArr.splice(0, rightArr.length);
            return concat;
        }


        public orderResList(rList){

        // Terminal condition - don't need to do anything for arrays with 0 or 1 items
        if (rList.length < 2) {
            return rList;
        }

        let sortedRList = [];
        let i;
        let len;

        for (i=0, len=rList.length; i < len; i++){
            sortedRList.push([rList[i]]);
        }
        sortedRList.push([]);  //in case of odd number of items

        for (let lim=len; lim > 1; lim = Math.floor((lim+1)/2)){
            for (var a=0,b=0; b < lim; a++, b+=2){
                sortedRList[a] = this.mergeSort(sortedRList[b], sortedRList[b+1]);
            }
            sortedRList[a] = [];  //in case of odd number of items
        }

        return sortedRList[0];
}
        
        public static runOneDiskProcess(fileName:string, pid:number){

            if(_currentProcess == undefined){
                _residentList[0].location = "disk";
                fileSystemDeviceDriver.createFile("process"+_residentList[0].pid.toString());
                fileSystemDeviceDriver.writeFile("process"+_residentList[0].pid.toString(), 
                    _memManager.getCodeFromMem(_residentList[0].base, _residentList[0].limit));
                Control.updateDiskTable();
                _residentList[pid].base = 0;
                _residentList[pid].limit = 255;
                _residentList[pid].PC = 0;
                _residentList[pid].location = "memory";
            }else{
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

            let hex = fileSystemDeviceDriver.readChain(fileName);
            let hexStart = 0;
            let hexEnd = 1;
            let counter = _residentList[pid].base;
            _memManager.clearMemSeg(counter, _residentList[pid].limit);
            for(var i = counter; i < _residentList[pid].limit; i++){

                var codes = hex.charAt(hexStart) + hex.charAt(hexEnd);
                if(codes ==""){
                    _memManager.memory[i] = new Byte("00");
                    hexStart += 2;
                    hexEnd += 2;
                }else {
                    _memManager.memory[i] = new Byte(codes);
                    hexStart += 2;
                    hexEnd += 2;
                }
            }
            _currentProcess = _residentList[pid];
            fileSystemDeviceDriver.deleteFile(fileName);
            Control.updateDiskTable();
            _CPU.isExecuting = true;
        }

        
        
        
        public contextSwitch():void {
            if (_qCount == _quantum){
                _qCount = 0;
                
                if(_readyQueue.getSize() > 0) {
                    let nextProcess = _readyQueue.getProcess(0);
                    if(nextProcess != undefined && nextProcess.location == "disk"){
                        this.swap("", 0);
                    }else{
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
        }
        
        public contextSwitchBreak():void {
            _qCount = 0;
            if (_readyQueue.getSize() > 0) {
                let nextProcess = _readyQueue.getProcess(0);
                
                if(nextProcess != undefined && nextProcess.location == "disk"){
                    this.swap("", 0);
                }else{
                _CPU.isExecuting = true;
                _CPU.updatePCB(_CPU);
                _currentProcess.state = 2;
                _currentProcess = _readyQueue.dequeue();
                _CPU.updateCPU(_currentProcess);
                }
            }else{
                _CPU.isExecuting = false;
                _StdOut.advanceLine();
                _StdOut.putText("Finished Execution");
                
            }
        }
    }
}