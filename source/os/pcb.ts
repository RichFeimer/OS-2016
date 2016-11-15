///<reference path="../globals.ts" />


module TSOS {
    export class pcb {
        constructor(public state = 0, //1 means ready, 0 means waiting, 2 means done
                public pid: number = 0,
                public PC: number = 0,
                public Acc: number = 0,
                public Xreg: number = 0,
                public Yreg: number = 0,
                public Zflag: number = 0,
                public base: number = 0,
                public limit: number = 0,
                public isExecuting: boolean = false) {
        }
    
    
        public init(pid, base, limit, PC): void {
            this.state = 0;
            this.pid = pid;
            this.PC = PC;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = base;
            this.limit = limit;
            this.isExecuting = false;
        }
    }
}