

module TSOS{

    export class fileSystemDeviceDriver{
    
        public defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
        public mbrStorageVal = "MBR000000000000000000000000000000000000000000000000000000000";
    
        constructor(){
        }
        
        public init(): void{
            
            sessionStorage.clear();
            for(let t = 0; t < 4; t++){
                for(let s = 0; s < 8; s++){
                    for(let b = 0; b < 8; b++){
                        let storageKey = t.toString() + s.toString() + b.toString();
                        if(storageKey == "000"){
                            sessionStorage.setItem(storageKey, "1" + "000" + this.mbrStorageVal + this.defaultStorageVal);
                        }else{
                            sessionStorage.setItem(storageKey, "0" + "000" + this.defaultStorageVal + this.defaultStorageVal);
                        }                            
                    }
                }
            }
        }
    
        public static format():void{
            
            let defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
            let mbrStorageVal = "MBR000000000000000000000000000000000000000000000000000000000";
            sessionStorage.clear();
            for(let t = 0; t < 4; t++){
                for(let s = 0; s < 8; s++){
                    for(let b = 0; b < 8; b++){
                        let storageKey = t.toString() + s.toString() + b.toString();
                        if(storageKey == "000"){
                            sessionStorage.setItem(storageKey, "1" + "000" + mbrStorageVal + defaultStorageVal);
                        }else{
                            sessionStorage.setItem(storageKey, "0" + "000" + defaultStorageVal + defaultStorageVal);
                        }                            
                    }
                }
            }   
        }
        //Fill unused space with 0s
        public static completeData(val: string):string{
            var finalData = val;
            
            for(let i=0; i<60-(val.length/2); i++){
                finalData+= "00";
            }
            return finalData;
        }
        
        
        public static hexToString(val: string):string{
            let newVal = "";
            for(let i =0; i< val.length; i+=2){
                let hex = (val.charAt(i) + val.charAt(i + 1)).toString();
                let ascii = parseInt(hex, 16);
                let string = String.fromCharCode(ascii);
                newVal += string;
            }
            return newVal;
        }
        
        public static stringToHex(val:string):string{
            var newVal ="";
            for(let i = 0; i < val.length; i++){
                let hex = val.toString().charCodeAt(i).toString(16);
                newVal+=hex.toString();
            }
            return newVal;
        
        }
        //returns the TSB for an open block
        public static checkDirTrack():string{
            let trackZero = "0";
            for (let s = 0; s < 8; s++){
                for (let b = 0; b < 8; b++){
                    let dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey) == null){ 
                        return dirKey;
                    }else if(sessionStorage.getItem(dirKey).charAt(0) == "0"){
                        return dirKey;
                    }
                }
            }
            return "none";
        }
        
        //Look for empty space on the track
        public static checkTracksForSpace():string{
            for (let t =1; t < 4; t++){
                for (let s = 0; s < 8; s++){
                    for (let b = 0; b < 8; b++){
                        let trackKey = t.toString() + s.toString() + b.toString();
                        if(sessionStorage.getItem(trackKey).charAt(0) == "0"){
                            return trackKey;
                        }
                    }
                }
            }
            return "none";
        }
        
        //Returns true if filename matches existing file, false otherwise
        public static checkDirTrackForFileName(fileName:string):boolean{
            let fName = this.stringToHex(fileName);
            let trackZero = "0";
            for (let s = 0; s < 8; s++){
                for (let b = 0; b < 8; b++){
                    let dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey) == null){ 
                        return false;
                    }else if (sessionStorage.getItem(dirKey).slice(4, fName.length + 4) == fName){
                        return true;
                    }
                }
            }
            return false;
        }
        
        
        public static checkTracks():string{
            for (var t = 1; t < 4; t++){
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        let trackKey = t.toString() + s.toString() + b.toString();
                        if (sessionStorage.getItem(trackKey) == null){ 
                            return trackKey;
                        }else if (sessionStorage.getItem(trackKey).charAt(0) == "0"){
                            return trackKey;
                            
                        }
                    }
                }
            }
        }
        
        //Figure out how many blocks are needed given a string of 'val' length
        public static detNumOfBlocks(val:string):number{
            return Math.ceil(val.length/60);
        }
        
        public static checkDirForNameTSB(fileName:string):string{
            let name = this.stringToHex(fileName);
            let trackZero = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    let dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey).slice(4, name.length+4) == name){
                        let trackTSB = sessionStorage.getItem(dirKey).slice(1,4);
                        return trackTSB;
                    }
                }
            }
        }
        
        //Returns the TSB of the directory block a file is in
        public static getDirBlockTSB(fileName:string):string{
            let name = this.stringToHex(fileName);
            let trackZero = "0";
            for(var s = 0; s < 8; s++){
                for(var b = 0; b < 8; b++){
                    let dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey).slice(4, name.length+4) == name){
                        return dirKey;
                    }
                }
            }
        }
        
        //Grab the next TSB in the chain
        public static getNextTSB(TSB:string):string{
            return sessionStorage.getItem(TSB).slice(1,4);
        }
        
        
        public static setChain(fileData:string, fileName:string):void{
            let defaultStorageVal ="000000000000000000000000000000000000000000000000000000000000";
            let firstBlock = this.checkDirForNameTSB(fileName);
            let blocksNeeded = this.detNumOfBlocks(fileData);
            for (let i = 1; i < blocksNeeded; i++){
                let tracks = this.checkTracks();
                sessionStorage.setItem(firstBlock, "1" + tracks + defaultStorageVal + defaultStorageVal);
                sessionStorage.setItem(tracks, "1" + "000" + defaultStorageVal + defaultStorageVal);
                firstBlock = this.getNextTSB(firstBlock);
            }
        }
        
        
        public static deleteChain(fileName:string):void{
            let defaultStorageVal ="000000000000000000000000000000000000000000000000000000000000";
            let firstBlock = this.checkDirForNameTSB(fileName);
            let savedTSB = "";
            while(this.getNextTSB(firstBlock) != "000"){
                savedTSB = this.getNextTSB(firstBlock);
                sessionStorage.setItem(firstBlock, defaultStorageVal + defaultStorageVal);
                firstBlock = savedTSB;
            }
            sessionStorage.setItem(firstBlock, defaultStorageVal + defaultStorageVal);
        }
        
        public static writeChain(fileData: string, fileName:string):void{
            let defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
            let firstBlock = this.checkDirForNameTSB(fileName);
            let blocksNeeded = this.detNumOfBlocks(fileData);
            let beginSubstring = 0;
            let endSubstring = 60;
            
            while (this.getNextTSB(firstBlock)!="000"){
                let substring = this.stringToHex(fileData.slice(beginSubstring, endSubstring));
                sessionStorage.setItem(firstBlock, "1" + this.getNextTSB(firstBlock) + substring);
                firstBlock = this.getNextTSB(firstBlock);
                beginSubstring += 60;
                endSubstring += 60;
            }
            sessionStorage.setItem(firstBlock, "1"+ "000" + this.completeData(this.stringToHex(fileData.slice(beginSubstring))));
        }
        
        public static readChain(fileName:string):string{
            if (this.checkDirTrackForFileName(fileName) == false){
                _StdOut.putText("Error: File " + fileName + " does not exist.");
            }else{
                let defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
                let firstBlock = this.checkDirForNameTSB(fileName);
                let data = "";
                
                while (this.getNextTSB(firstBlock) != "000"){
                    let concat = sessionStorage.getItem(firstBlock).slice(4);
                    data += concat;
                    firstBlock = this.getNextTSB(firstBlock);
                }
                data += sessionStorage.getItem(firstBlock).slice(4);
                let ascii = this.hexToString(data);
                return ascii;
            }
            
        }
        //Create a file on the disk
        public static createFile(fileName:string):void{
            if(this.checkDirTrackForFileName(fileName) == true){
                _StdOut.putText("Error: File " + fileName + " already exists" );
            }else if(this.checkDirTrack() == "none"){
                _StdOut.putText("ERROR: No space available on disk");
            }else{
                let defaultInUseTrackVal = "000000000000000000000000000000000000000000000000000000000000000";
                sessionStorage.setItem(this.checkDirTrack(), "1" + this.checkTracks() + this.completeData(this.stringToHex(fileName)));
                sessionStorage.setItem(this.checkTracks(), "1" + defaultInUseTrackVal + defaultInUseTrackVal + "0");

            }
        }
        //write to an existing file on the disk
        public static writeFile(fileData:string, fileName:string):void{
            if (this.checkDirTrackForFileName(fileName) == false){
                _StdOut.putText("ERROR: File " + fileName + " does not exist on disk.");
                
            }else if (this.checkTracksForSpace() == "none"){
                _StdOut.putText("ERROR: No space available on disk");
            }else{
                if(this.stringToHex(fileData).length <= 120) {
                    sessionStorage.setItem(this.checkDirForNameTSB(fileName), "1" + "000" + this.completeData(this.stringToHex(fileData)));
                }else{
                    this.setChain(fileData, fileName);
                    this.writeChain(fileData, fileName);
                }
            }
        }
        
        public static readFile(fileName:string):void{
            if (this.checkDirTrackForFileName(fileName) == false){
                _StdOut.putText("ERROR: File " + fileName + " does not exist on disk.");
            }else{
                _Kernel.krnTrace("READ STRING:" + this.readChain(fileName));
                _StdOut.putText(this.readChain(fileName));
            }
        }
        
        public static deleteFile(fileName:string):void{
            if (this.checkDirTrackForFileName(fileName) == false){
                _StdOut.putText("ERROR: File " + fileName + " does not exist on disk.");
            }else{
                let defaultStorageVal = "0000000000000000000000000000000000000000000000000000000000000000";
                this.deleteChain(fileName);
                sessionStorage.setItem(this.getDirBlockTSB(fileName), defaultStorageVal + defaultStorageVal);
            }
        }
        
        
        
    }    
}