///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />

/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (f.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');
            _memoryTable = <HTMLTableElement> document.getElementById('memoryTable');
            _cpuTable = <HTMLTableElement> document.getElementById('cpuTable');
            _pcbTable = <HTMLTableElement> document.getElementById('pcbQueueTable');
            _diskTable= <HTMLTableElement> document.getElementById('diskTable');
            
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            //Create memory table
            this.createMemoryTable();
            
            //Create disk table
            this.createDiskTable();
            
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
        
        public static createMemoryTable():void {
            for(var i = 0; i <96; i++){
                var row = <HTMLTableRowElement> _memoryTable.insertRow(i);
                for(var j = 0; j < 9; j++){
                    var cell = row.insertCell(j);
                    if(j == 0){
                        var header = (i*8).toString(16);
                        cell.innerHTML = "0x" + header;
                    }else{
                        cell.innerHTML = "00";
                    }
                }
            }
        }
        
        public static updateMemoryTable():void{
            let counter = 0;

            for(let i = 0; i < 96; i++){
                let rows = <HTMLTableRowElement>_memoryTable.rows[i];
                for(let j = 0; j < 9; j++){
                    let cell = <HTMLElement>rows.cells[j];
                    if(j == 0){
                        let header = (i*8).toString(16);
                        cell.innerHTML = "0x" + header;
                    }
                    else{
                        try{
                        cell.innerHTML = _memManager.memory[counter].byte;
                        counter++;
                        }catch(a){
                            if(a){
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        public static updateCpuTable():void{
            let rows = <HTMLTableRowElement>_cpuTable.rows[1];
            let cells = <HTMLElement>rows.cells[0];
            
            cells.innerHTML = _CPU.PC.toString();
            cells = <HTMLElement>rows.cells[1];
            cells.innerHTML = _CPU.IR;
            cells = <HTMLElement>rows.cells[2];
            cells.innerHTML = _CPU.Acc.toString();
            cells = <HTMLElement>rows.cells[3];
            cells.innerHTML = _CPU.Xreg.toString();
            cells = <HTMLElement>rows.cells[4];
            cells.innerHTML = _CPU.Yreg.toString();
            cells = <HTMLElement>rows.cells[5];
            cells.innerHTML = _CPU.Zflag.toString();
        }
        
        
        public static updatePcbTable():void{
            if(_currentProcess != null) {
                var rows = <HTMLTableRowElement>_pcbTable.rows[1];
                var cells = <HTMLElement>rows.cells[0];
                cells.innerHTML = _currentProcess.pid.toString();
                cells = <HTMLElement>rows.cells[1];
                cells.innerHTML = _currentProcess.PC.toString();
                cells = <HTMLElement>rows.cells[2];
                cells.innerHTML = _CPU.IR;
                cells = <HTMLElement>rows.cells[3];
                cells.innerHTML = _currentProcess.Acc.toString();
                cells = <HTMLElement>rows.cells[4];
                cells.innerHTML = _currentProcess.Xreg.toString();
                cells = <HTMLElement>rows.cells[5];
                cells.innerHTML = _currentProcess.Yreg.toString();
                cells = <HTMLElement>rows.cells[6];
                cells.innerHTML = _currentProcess.Zflag.toString();
                cells = <HTMLElement>rows.cells[7];
                cells.innerHTML = _currentProcess.base.toString();
                cells = <HTMLElement>rows.cells[8];
                cells.innerHTML = _currentProcess.limit.toString();
                cells = <HTMLElement>rows.cells[9];
                cells.innerHTML = _currentProcess.state.toString();
                }

            if(_readyQueue.getProcess(0) != null) {
                rows = <HTMLTableRowElement>_pcbTable.rows[2];
                cells = <HTMLElement>rows.cells[0];
                cells.innerHTML = _readyQueue.getProcess(0).pid.toString();
                cells = <HTMLElement>rows.cells[1];
                cells.innerHTML = _readyQueue.getProcess(0).PC.toString();
                cells = <HTMLElement>rows.cells[2];
                //cells.innerHTML = _memManager.memory[_readyQueue.getProcess(0).PC].byte;
                cells = <HTMLElement>rows.cells[3];
                cells.innerHTML = _readyQueue.getProcess(0).Acc.toString();
                cells = <HTMLElement>rows.cells[4];
                cells.innerHTML = _readyQueue.getProcess(0).Xreg.toString();
                cells = <HTMLElement>rows.cells[5];
                cells.innerHTML = _readyQueue.getProcess(0).Yreg.toString();
                cells = <HTMLElement>rows.cells[6];
                cells.innerHTML = _readyQueue.getProcess(0).Zflag.toString();
                cells = <HTMLElement>rows.cells[7];
                cells.innerHTML = _readyQueue.getProcess(0).base.toString();
                cells = <HTMLElement>rows.cells[8];
                cells.innerHTML = _readyQueue.getProcess(0).limit.toString();
                cells = <HTMLElement>rows.cells[9];
                cells.innerHTML = _readyQueue.getProcess(0).state.toString();
                }


                if(_readyQueue.getProcess(1) != null){
                rows = <HTMLTableRowElement>_pcbTable.rows[3];
                cells = <HTMLElement>rows.cells[0];
                cells.innerHTML = _readyQueue.getProcess(1).pid.toString();
                cells = <HTMLElement>rows.cells[1];
                cells.innerHTML = _readyQueue.getProcess(1).PC.toString();
                cells = <HTMLElement>rows.cells[2];
                cells.innerHTML = _memManager.memory[_readyQueue.getProcess(1).PC].byte;
                cells = <HTMLElement>rows.cells[3];
                cells.innerHTML = _readyQueue.getProcess(1).Acc.toString();
                cells = <HTMLElement>rows.cells[4];
                cells.innerHTML = _readyQueue.getProcess(1).Xreg.toString();
                cells = <HTMLElement>rows.cells[5];
                cells.innerHTML = _readyQueue.getProcess(1).Yreg.toString();
                cells = <HTMLElement>rows.cells[6];
                cells.innerHTML = _readyQueue.getProcess(1).Zflag.toString();
                cells = <HTMLElement>rows.cells[7];
                cells.innerHTML = _readyQueue.getProcess(1).base.toString();
                cells = <HTMLElement>rows.cells[8];
                cells.innerHTML = _readyQueue.getProcess(1).limit.toString();
                cells = <HTMLElement>rows.cells[9];
                cells.innerHTML = _readyQueue.getProcess(1).state.toString();
                }
                
                if(_readyQueue.getProcess(2) != null) {
                rows = <HTMLTableRowElement>_pcbTable.rows[4];
                cells = <HTMLElement>rows.cells[0];
                cells.innerHTML = _readyQueue.getProcess(2).pid.toString();
                cells = <HTMLElement>rows.cells[1];
                cells.innerHTML = _readyQueue.getProcess(2).PC.toString();
                cells = <HTMLElement>rows.cells[2];
                cells.innerHTML = _memManager.memory[_readyQueue.getProcess(2).PC].byte;
                cells = <HTMLElement>rows.cells[3];
                cells.innerHTML = _readyQueue.getProcess(2).Acc.toString();
                cells = <HTMLElement>rows.cells[4];
                cells.innerHTML = _readyQueue.getProcess(2).Xreg.toString();
                cells = <HTMLElement>rows.cells[5];
                cells.innerHTML = _readyQueue.getProcess(2).Yreg.toString();
                cells = <HTMLElement>rows.cells[6];
                cells.innerHTML = _readyQueue.getProcess(2).Zflag.toString();
                cells = <HTMLElement>rows.cells[7];
                cells.innerHTML = _readyQueue.getProcess(2).base.toString();
                cells = <HTMLElement>rows.cells[8];
                cells.innerHTML = _readyQueue.getProcess(2).limit.toString();
                cells = <HTMLElement>rows.cells[9];
                cells.innerHTML = _readyQueue.getProcess(2).state.toString();
                }



        }
        
        
        public static createDiskTable():void{
            for(let x = 0; x<256; x++){
                let row = <HTMLTableRowElement>_diskTable.insertRow(x);
                for(let columns = 0; columns < 2; columns++){
                    let cell = row.insertCell(columns);
                    if(columns ==0){
                      cell.innerHTML = sessionStorage.key(x);
                    }else{
                        cell.innerHTML = sessionStorage.getItem(sessionStorage.key(x));
                    }
                }
            }
        }
        
        
        public static updateDiskTable():void{
            for(let x = 0; x < 256; x++){
                let row = <HTMLTableRowElement>_diskTable.rows[x];

                for(let columns = 0; columns < 2; columns++){
                    let cell = <HTMLElement>row.cells[columns];
                    if(columns ==0){
                        cell.innerHTML = sessionStorage.key(x);
                    }
                    else{
                        cell.innerHTML = sessionStorage.getItem(sessionStorage.key(x));
                    }
                }
            }
        }
        
        
        
    }
}
