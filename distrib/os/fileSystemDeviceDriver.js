var TSOS;
(function (TSOS) {
    var fileSystemDeviceDriver = (function () {
        function fileSystemDeviceDriver() {
            this.defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
            this.mbrStorageVal = "MBR000000000000000000000000000000000000000000000000000000000";
        }
        fileSystemDeviceDriver.prototype.init = function () {
            sessionStorage.clear();
            for (var t = 0; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var storageKey = t.toString() + s.toString() + b.toString();
                        if (storageKey == "000") {
                            sessionStorage.setItem(storageKey, "1" + "000" + this.mbrStorageVal + this.defaultStorageVal);
                        }
                        else {
                            sessionStorage.setItem(storageKey, "0" + "000" + this.defaultStorageVal + this.defaultStorageVal);
                        }
                    }
                }
            }
        };
        fileSystemDeviceDriver.format = function () {
            var defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
            var mbrStorageVal = "MBR000000000000000000000000000000000000000000000000000000000";
            sessionStorage.clear();
            for (var t = 0; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var storageKey = t.toString() + s.toString() + b.toString();
                        if (storageKey == "000") {
                            sessionStorage.setItem(storageKey, "1" + "000" + mbrStorageVal + defaultStorageVal);
                        }
                        else {
                            sessionStorage.setItem(storageKey, "0" + "000" + defaultStorageVal + defaultStorageVal);
                        }
                    }
                }
            }
        };
        //Fill unused space with 0s
        fileSystemDeviceDriver.completeData = function (val) {
            var finalData = val;
            for (var i = 0; i < 60 - (val.length / 2); i++) {
                finalData += "00";
            }
            return finalData;
        };
        fileSystemDeviceDriver.hexToString = function (val) {
            var newVal = "";
            for (var i = 0; i < val.length; i += 2) {
                var hex = (val.charAt(i) + val.charAt(i + 1)).toString();
                var ascii = parseInt(hex, 16);
                var string = String.fromCharCode(ascii);
                newVal += string;
            }
            return newVal;
        };
        fileSystemDeviceDriver.stringToHex = function (val) {
            var newVal = "";
            for (var i = 0; i < val.length; i++) {
                var hex = val.toString().charCodeAt(i).toString(16);
                newVal += hex.toString();
            }
            return newVal;
        };
        //returns the TSB for an open block
        fileSystemDeviceDriver.checkDirTrack = function () {
            var trackZero = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey) == null) {
                        return dirKey;
                    }
                    else if (sessionStorage.getItem(dirKey).charAt(0) == "0") {
                        return dirKey;
                    }
                }
            }
            return "none";
        };
        //Look for empty space on the track
        fileSystemDeviceDriver.checkTracksForSpace = function () {
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var trackKey = t.toString() + s.toString() + b.toString();
                        if (sessionStorage.getItem(trackKey) == null) {
                            return trackKey;
                        }
                        else if (sessionStorage.getItem(trackKey).charAt(0) == "0") {
                            return trackKey;
                        }
                    }
                }
            }
            return "none";
        };
        //Returns true if filename matches existing file, false otherwise
        fileSystemDeviceDriver.checkDirTrackForFileName = function (fileName) {
            var fName = this.stringToHex(fileName);
            var trackZero = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey) == null) {
                        return false;
                    }
                    else if (sessionStorage.getItem(dirKey).slice(4, fName.length + 4) == fName) {
                        return true;
                    }
                }
            }
            return false;
        };
        fileSystemDeviceDriver.checkTracks = function () {
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var trackKey = t.toString() + s.toString() + b.toString();
                        if (sessionStorage.getItem(trackKey) == null) {
                            return trackKey;
                        }
                        else if (sessionStorage.getItem(trackKey).charAt(0) == "0") {
                            return trackKey;
                        }
                    }
                }
            }
        };
        //Figure out how many blocks are needed given a string of 'val' length
        fileSystemDeviceDriver.detNumOfBlocks = function (val) {
            return Math.ceil(val.length / 60);
        };
        fileSystemDeviceDriver.checkDirForNameTSB = function (fileName) {
            var name = this.stringToHex(fileName);
            var trackZero = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey).slice(4, name.length + 4) == name) {
                        var trackTSB = sessionStorage.getItem(dirKey).slice(1, 4);
                        return trackTSB;
                    }
                }
            }
        };
        //Returns the TSB of the directory block a file is in
        fileSystemDeviceDriver.getDirBlockTSB = function (fileName) {
            var name = this.stringToHex(fileName);
            var trackZero = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var dirKey = trackZero + s.toString() + b.toString();
                    if (sessionStorage.getItem(dirKey).slice(4, name.length + 4) == name) {
                        return dirKey;
                    }
                }
            }
        };
        //Grab the next TSB in the chain
        fileSystemDeviceDriver.getNextTSB = function (TSB) {
            return sessionStorage.getItem(TSB).slice(1, 4);
        };
        fileSystemDeviceDriver.setChain = function (fileData, fileName) {
            var defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
            var firstBlock = this.checkDirForNameTSB(fileName);
            var blocksNeeded = this.detNumOfBlocks(fileData);
            for (var i = 1; i < blocksNeeded; i++) {
                var tracks = this.checkTracks();
                sessionStorage.setItem(firstBlock, "1" + tracks + defaultStorageVal + defaultStorageVal);
                sessionStorage.setItem(tracks, "1" + "000" + defaultStorageVal + defaultStorageVal);
                firstBlock = this.getNextTSB(firstBlock);
            }
        };
        fileSystemDeviceDriver.deleteChain = function (fileName) {
            var defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
            var firstBlock = this.checkDirForNameTSB(fileName);
            var savedTSB = "";
            while (this.getNextTSB(firstBlock) != "000") {
                savedTSB = this.getNextTSB(firstBlock);
                sessionStorage.setItem(firstBlock, defaultStorageVal + defaultStorageVal);
                firstBlock = savedTSB;
            }
            sessionStorage.setItem(firstBlock, defaultStorageVal + defaultStorageVal);
        };
        fileSystemDeviceDriver.writeChain = function (fileData, fileName) {
            var defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
            var firstBlock = this.checkDirForNameTSB(fileName);
            var blocksNeeded = this.detNumOfBlocks(fileData);
            var beginSubstring = 0;
            var endSubstring = 60;
            while (this.getNextTSB(firstBlock) != "000") {
                var substring = this.stringToHex(fileData.slice(beginSubstring, endSubstring));
                sessionStorage.setItem(firstBlock, "1" + this.getNextTSB(firstBlock) + substring);
                firstBlock = this.getNextTSB(firstBlock);
                beginSubstring += 60;
                endSubstring += 60;
            }
            sessionStorage.setItem(firstBlock, "1" + "000" + this.completeData(this.stringToHex(fileData.slice(beginSubstring))));
        };
        fileSystemDeviceDriver.readChain = function (fileName) {
            if (this.checkDirTrackForFileName(fileName) == false) {
                _StdOut.putText("Error: File " + fileName + " does not exist.");
            }
            else {
                var defaultStorageVal = "000000000000000000000000000000000000000000000000000000000000";
                var firstBlock = this.checkDirForNameTSB(fileName);
                var data = "";
                while (this.getNextTSB(firstBlock) != "000") {
                    var concat = sessionStorage.getItem(firstBlock).slice(4);
                    data += concat;
                    firstBlock = this.getNextTSB(firstBlock);
                }
                data += sessionStorage.getItem(firstBlock).slice(4);
                var ascii = this.hexToString(data);
                return ascii;
            }
        };
        //Create a file on the disk
        fileSystemDeviceDriver.createFile = function (fileName) {
            if (this.checkDirTrackForFileName(fileName) == true) {
                _StdOut.putText("Error: File " + fileName + " already exists");
            }
            else if (this.checkDirTrack() == "none") {
                _StdOut.putText("ERROR: No space available on disk");
            }
            else {
                var defaultInUseTrackVal = "000000000000000000000000000000000000000000000000000000000000000";
                sessionStorage.setItem(this.checkDirTrack(), "1" + this.checkTracks() + this.completeData(this.stringToHex(fileName)));
                sessionStorage.setItem(this.checkTracks(), "1" + defaultInUseTrackVal + defaultInUseTrackVal + "0");
            }
        };
        //write to an existing file on the disk
        fileSystemDeviceDriver.writeFile = function (fileName, fileData) {
            if (this.checkDirTrackForFileName(fileName) == false) {
                _StdOut.putText("ERROR: File " + fileName + " does not exist on disk.");
            }
            else if (this.checkTracksForSpace() == "none") {
                _StdOut.putText("ERROR: No space available on disk");
            }
            else {
                if (this.stringToHex(fileData).length <= 120) {
                    sessionStorage.setItem(this.checkDirForNameTSB(fileName), "1" + "000" + this.completeData(this.stringToHex(fileData)));
                }
                else {
                    this.setChain(fileData, fileName);
                    this.writeChain(fileData, fileName);
                }
            }
        };
        fileSystemDeviceDriver.readFile = function (fileName) {
            if (this.checkDirTrackForFileName(fileName) == false) {
                _StdOut.putText("ERROR: File " + fileName + " does not exist on disk.");
            }
            else {
                _Kernel.krnTrace("READ STRING:" + this.readChain(fileName));
                _StdOut.putText(this.readChain(fileName));
            }
        };
        fileSystemDeviceDriver.deleteFile = function (fileName) {
            if (this.checkDirTrackForFileName(fileName) == false) {
                _StdOut.putText("ERROR: File " + fileName + " does not exist on disk.");
            }
            else {
                var defaultStorageVal = "0000000000000000000000000000000000000000000000000000000000000000";
                this.deleteChain(fileName);
                sessionStorage.setItem(this.getDirBlockTSB(fileName), defaultStorageVal + defaultStorageVal);
            }
        };
        return fileSystemDeviceDriver;
    }());
    TSOS.fileSystemDeviceDriver = fileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
