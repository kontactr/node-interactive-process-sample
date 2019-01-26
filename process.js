/* Simple Hello World in Node.js */
console.log("Hello World");

const streams = require("stream");
const spawn = require("child_process").spawn;

const processCount= spawn("node.exe" , ["-i"] , {
    
});

const transformInput = new streams.Transform({
    objectMode: true,
    transform(chunk,en,cb){
        let result = chunk.toString().split(" ");
        console.log(result);
        this.push(result.toString());
        cb();
    }
});


//process.stdin.pipe(transformInput).pipe(process.stdout);
//console.log("hello world");

//process.stdin.pipe(processCount.stdin);
//processCount.stdout.pipe(process.stdout);
//processCount.stderr.pipe(process.stderr);

let commands = ["console.log('Hello World 1')",
"console.log('Hello World 2')",
"console.log('Hello World 3')",
"console.log('Hello World 4')",
"console.log('Hello World 5')",
"console.log(2+2+2+2)"];
let count =  0;
const childProcessInput = new streams.Readable({
    

    read(size){
        //console.log(count , commands);
        if(count < commands.length){
            this.push(commands[count] + "\n");
            count += 1;
            //console.log("once");
        }else{
            //console.log("Once Second");
            this.push(null);
        }
    }

});

const childProcessOutput = new streams.Writable({
    objectMode: true,

    write(chunk , en , cb){
        console.log();
        console.log("start");
        console.log(chunk.toString());
        clearImmediate();
        console.log("Done....");
        cb();     
    }
})

childProcessInput.pipe(processCount.stdin);
processCount.stdout.pipe(childProcessOutput);
processCount.stderr.pipe(process.stderr);
//console.log(processCount.stdout.toString());