///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public _memManager;
        public _cpuSched;
        
        constructor() {
            _memManager = new TSOS.memoryManager();
            _cpuSched = new TSOS.cpuScheduler();
            _readyQueue = new TSOS.Queue();
            _fsdd = new TSOS.fileSystemDeviceDriver();
        }
        
        
        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

			// date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time.")
			this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereami,
                                  "whereami",
								  "- Displays the user's current location.")
            this.commandList[this.commandList.length] = sc;
			
            // paradox
            sc = new ShellCommand(this.shellParadox,
			                      "paradox",
								  "- Attempts to fry the computer by forcing it to contemplate a paradox.")
            this.commandList[this.commandList.length] = sc;
			
            // Blue Screen Of Death
            sc = new ShellCommand(this.shellBSOD,
                                  "bsod",
            					  "- Tests the BSOD.")
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                                  "status",
            					  "<string> - Sets the status.")
            this.commandList[this.commandList.length] = sc;
            
            // load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
            					  " [<priority>]- Validates the user code.")
            this.commandList[this.commandList.length] = sc;
            
            // run
            sc = new ShellCommand(this.shellRun,
                                  "run",
            					  "<PID> - executes a program in memory")
            this.commandList[this.commandList.length] = sc;
            
            // clear memory
            sc = new ShellCommand(this.shellClearMem,
                                  "clearmem",
            					  "- clears the memory")
            this.commandList[this.commandList.length] = sc;
            
            // runall
            sc = new ShellCommand(this.shellRunall,
                                  "runall",
            					  " - executes all programs in memory")
            this.commandList[this.commandList.length] = sc;
            
            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellPs,
                                  "ps",
                                  " - displays the PIDs of all active processes.");
            this.commandList[this.commandList.length] = sc;
           
           //quantum
           sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  " <int> - sets the quantum for Round Robin");
            this.commandList[this.commandList.length] = sc;
           
           // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill,
                                  "kill",
                                  "<PID> - kills active process");
            this.commandList[this.commandList.length] = sc;
            
           // create <filename>
            sc = new ShellCommand(this.shellCreate,
                                  "create",
                                  "<filename> - creates a new file");
            this.commandList[this.commandList.length] = sc;
            
            //read <filename>
           sc = new ShellCommand(this.shellRead,
                                  "read",
                                  " <filename> - displays the contents of a file");
            this.commandList[this.commandList.length] = sc;
            
            //write <filename>
           sc = new ShellCommand(this.shellWrite,
                                  "write",
                                  " <filename> \"data\" - writes the text in quotes to the file");
            this.commandList[this.commandList.length] = sc;
            
            //delete <filename>
           sc = new ShellCommand(this.shellDelete,
                                  "delete",
                                  " <filename> - deletes a file");
            this.commandList[this.commandList.length] = sc;
            
            //format
           sc = new ShellCommand(this.shellFormat,
                                  "format",
                                  " - initializes entire disk");
            this.commandList[this.commandList.length] = sc;
            
            //setSchedule
           sc = new ShellCommand(this.shellSetSchedule,
                                  "setschedule",
                                  " [rr, fcfs, priority] - sets the scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            
            //getSchedule
           sc = new ShellCommand(this.shellGetSchedule,
                                  "getschedule",
                                  " - displays the current scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            
            //ls
           sc = new ShellCommand(this.shellLs,
                                  "ls",
                                  " - lists files currently stored on disk");
            this.commandList[this.commandList.length] = sc;
            
            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
					case "ver":
					    _StdOut.putText("Ver displays the current version.");
						break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellDate(args) {
            var now = new Date();
			let hr = now.getHours();
            let min = now.getMinutes();
            if (min < 10) { min = parseInt("0" + min.toString());}
            _StdOut.putText("It is " + hr + ":" + min + " on " + (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear())
            //TODO: Perhaps change to 12 hour format
        }
		
        public shellWhereami(args) {
            _StdOut.putText("Earth, dummy");
		}
		
        public shellParadox(args) {
            _StdOut.putText("Nice try.");
		}
		
        public shellBSOD(args) {
            document.getElementById("display").style.backgroundColor = 'rgb(19, 72, 220)';
            _StdOut.clearScreen();
            _StdOut.resetXY();
            _StdOut.putText("An error has occured. Please Reset.");
		}

        public shellStatus(args) {
            //let newStatus = ((args.replace(/,/g, ' ')).toString()); 
            //My attempt to replace commas in the status with spaces has an odd effect. I'll try again later.
            document.getElementById("tbs").innerHTML = args;
		}
        
        public shellLoad(args) {
            var userText = <HTMLInputElement>document.getElementById("taProgramInput");
            var inputString = userText.value.trim();
            var code = inputString.replace(/ /g, '');
            var inputCount = 0;
            //var _memManager = new TSOS.memoryManager();
            //Check the code's validity
            if (userText.value.length ==0){
                    _StdOut.putText("You have to give me something to work with...");
                } else{
            
                    for (var i = 0; i < code.length; i++){
                        if (code.charAt(i).match(/[0-9A-Fa-f\s]/g) != null){
                            inputCount++;
                        }
                    }
                    if (inputCount == code.length && typeof code !== 'undefined'){
                        
                       if(args[0] != undefined && args[0] > 0){
                           _memManager.loadToMemory(code, args[0]);
                       }else{
                           _memManager.loadToMemory(code, 10);
                       }
                
                    }
                    else{_StdOut.putText("Your input is invalid.");
                    }
            
                //function isHex(h) {
                //    let spaceRmv = h.replace(/ /g, '');
                //    let check = parseInt(spaceRmv,16);
                //    return (check.toString(16) === spaceRmv.toLowerCase());
                //}   
                //if (isHex(userText.value)) {_StdOut.putText("Valid code")}
                //    else _StdOut.putText("Invalid code");
		
                }
        }
        public shellRun(args) {
            let run = false;
            for(var i = 0; i < _residentList.length; i++){
                let resPid = _residentList[i].pid;
                if(resPid == args){
                    _currentProcess = _residentList[i];
                    _CPU.updateCPU(_currentProcess);
                    _CPU.isExecuting = true;
                    run = true;
                }
                if(run){
                    _StdOut.putText("Running PID " + args);
                }else{
                    _StdOut.putText("Error: Cannot run PID " + args);
                }
            }
        }
        
        public shellClearMem(args) {
            _memManager.clearMemory();
            _StdOut.putText("Memory cleared");
        }
        
        public shellRunall(args) {
            //sort list if priority
            if(_schedule == "priority"){
                _residentList = _cpuSched.orderResList(_residentList);
            }
            
            let counter = 0;
            for(var i = 0; i < _residentList.length; i++){
                _StdOut.putText(" Running " + _residentList[counter].pid);
                _readyQueue.enqueue(_residentList[counter]);
                _Kernel.krnTrace("SIZE OF QUEUE = " + _residentList.length);
                _Kernel.krnTrace("FIRST PID =  " + _readyQueue.getProcess(0).pid.toString());
                
                counter++;
            }
            (_cpuSched).beginExecution();
        }
        
        public shellPs(args) {
            _StdOut.putText("Executing pids are " + _currentProcess.pid);
            for(var i = 0; i < _readyQueue.getSize(); i++){
                _StdOut.putText(" " + _readyQueue.getProcess(i).pid);
            }
        }
        
        public shellQuantum(args){
            if(args < 0){
                _StdOut.putText("Error: Quantum must be positive");
            }else{
                _quantum = args;
                _StdOut.putText("Quantum is " + args);
            }
        }
        
        public shellKill(args) {
            let foundPID = false;
            
            //check if process we want to end is executing
            if(_currentProcess.pid == args){
                if(_readyQueue.getSize() == 0){
                    //If it's the only process executing...
                    _CPU.isExecuting = false;
                    _memManager.clearMemSeg(_currentProcess.base, _currentProcess.limit);
                    _StdOut.putText("Process " + args + " terminated");
                }else{
                    //Otherwise....
                    _memManager.clearMemSeg(_currentProcess.base, _currentProcess.limit);
                    _currentProcess = _readyQueue.dequeue();
                    _CPU.updateCPU(_currentProcess);
                    _StdOut.putText("Process " + args + " terminated");
                }
            }else{
                //If it's not executing, it should be in the ready queue. Let us find it
                for(let i = 0; i< _readyQueue.getSize(); i++){
                    if(_readyQueue.getProcess(i).pid == args){
                        if(_readyQueue.getSize() == 1){
                            let terminate = _readyQueue.dequeue();
                        }else{
                            let terminate = _readyQueue.dequeue();
                            let keep = _readyQueue.dequeue();
                            
                            if(terminate.pid == args){
                                _memManager.clearMemSeg(terminate.base, keep.limit);
                                _readyQueue.enqueue(keep);
                                let foundPID = true;
                            }else{
                                _memManager.clearMemSeg(keep.base, keep.limit);
                                _readyQueue.enqueue(terminate);
                                let foundPID = true;
                            }
                        }
                    }
                }
            }
            
            if(foundPID){
                _StdOut.putText("Process " + args + " terminated");
            }
            
        }
        
        //Create new file 
        public shellCreate(args){
            if(args.length > 0 && args.length<=60){
                fileSystemDeviceDriver.createFile(args.join());
                _StdOut.putText("File " + args.join()+ " was created successfully");
                Control.updateDiskTable();
            }else{
                _StdOut.putText("File could not be created. Make sure it is between 1 and 60 characters");
            }
        }
        
        //Read existing file
        public shellRead(args){
            if (args.length > 0){
                fileSystemDeviceDriver.readFile(args.join());
            }
        }
        
        //Write to existing file
        public shellWrite(args){
            if(args.length >= 2){
                let fileData = "";
                for (let i = 1; i < args.length;i++){
                    fileData += args[i] + " ";
                }
                if(fileData.charAt(0) == "\"" && fileData.charAt(fileData.length - 2)=="\""){
                    fileSystemDeviceDriver.writeFile(args[0], fileData.slice(1, fileData.length -2));
                    _StdOut.putText("File " + args[0] + " was successfully written to");
                }else{
                    _StdOut.putText("ERROR: Please put data in quotes");
                }
                Control.updateDiskTable();
            }
        }
        
        //Delete file from disk
        public shellDelete(args){
            if (args.length > 0){
                _Kernel.krnTrace("DELETING FILE");
                fileSystemDeviceDriver.deleteFile(args.join());
                _StdOut.putText("File " + args.join()+ " was successfully deleted");
                Control.updateDiskTable();
            }
        }
        
        //Nuke the whole disk
        public shellFormat(args){
            fileSystemDeviceDriver.format();
             _StdOut.putText("Hard Drive Formatted Sucessfully.")
             Control.updateDiskTable();
        }
        
        public shellSetSchedule(args){
            if(args.length > 0){
                let newAlg = args[0].toLowerCase();
                if(newAlg == "rr" || newAlg == "fcfs" || newAlg == "priority"){
                    _schedule = newAlg;
                    _StdOut.putText("Scheduling algorithm set to " + newAlg);
                }else{
                    _StdOut.putText("Please enter rr, fcfs, or priority");
                }
            }else{
                _StdOut.putText("Please enter rr, fcfs, or priority");
            }
        }
        
        public shellGetSchedule(args){
            _StdOut.putText("The current scheduling algorithm is " + _schedule);
        }
        
        public shellLs(args){
            let trackZero = "0";
            for (let s = 0; s < 8; s++) {
                for (let b = 0; b < 8; b++) {
                    let dirKey = trackZero + s.toString() + b.toString();
                    if(sessionStorage.getItem(dirKey).charAt(1) == "1"){
                        _StdOut.putText(fileSystemDeviceDriver.hexToString(sessionStorage.getItem(dirKey).slice(4)));
                        _StdOut.advanceLine();
                    }
                } 
            }    
        }
        
        
        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

    }
}
