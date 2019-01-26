/* Simple Hello World in Node.js */
console.log("Hello World");

const streams = require("stream");
const spawn = require("child_process").spawn;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();



let commands = ["console.log('Hello World 1');",
"console.log('Hello World 2');",
"console.log('Hello World 3');",
"console.log('Hello World 4');",
"console.log('Hello World 5');",
"console.log(2+2+2+2)"];

let count =  0;




app.use(cors());

app.use(bodyParser.json());

app.post("/",(req , resp) => {

    const childProcess = spawn("node" , ["-i"]);
    commands = [];
    const requestInput = ";" + req.body.value + ";";
    commands.push(requestInput);
    console.log(requestInput);

    const childProcessInput = new streams.Readable({
        objectMode: true,
    
        read(size){
            if(count < commands.length){
                this.push(commands[count++]);
            }else{
                this.push(null);
            }
        }
    
    });
    
    count = 0;
    
    childProcessInput.pipe(childProcess.stdin);

    childProcess.once("close" , (code , signal) => {
        commands.pop();
        console.log("closed");
        //childProcessInput.removeAllListeners();
        //childProcess.removeAllListeners();
    });

    childProcess.stdout.pipe(resp);
    childProcess.stderr.pipe(resp);

    
});


app.listen(5251 , (e) => {
    console.log("Server is up");
});

/*const processCount= spawn("node.exe" , ["-i"] , {
    
});*/