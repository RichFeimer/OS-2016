///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var pcb = (function () {
        function pcb(state, //1 means ready, 0 means waiting, 2 means done
            pid, PC, Acc, Xreg, Yreg, Zflag, base, limit, priority, loc, isExecuting) {
            if (state === void 0) { state = 0; }
            if (pid === void 0) { pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (priority === void 0) { priority = 0; }
            if (loc === void 0) { loc = ""; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.priority = priority;
            this.loc = loc;
            this.isExecuting = isExecuting;
        }
        pcb.prototype.init = function (pid, base, limit, PC, priority, loc) {
            this.state = 0;
            this.pid = pid;
            this.PC = PC;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = base;
            this.limit = limit;
            this.priority = priority;
            this.loc = loc;
            this.isExecuting = false;
        };
        return pcb;
    }());
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
