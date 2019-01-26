var express = require("express");
var streams = require("stream");
var spawn = require("child_process").spawn;
const cors = require("cors");
const bodyParser = require("body-parser");

//let buffer = ["print ('hello world')\n"];
//let bufferOutput = [];

let childInputWritableStream = new streams.Readable({
    objectMode: true,

    read(chunk,data="pp"){
        let q = "Ss"     
        console.log("stream read",data);
        if(data !== "pp"){
            q = "";
        }
        if(!q ){
            let temp = data;
            console.log(temp);
            this.push(temp);
        }
    }

});


let childOutputReadableStream = new streams.Writable({
    objectMode: true,

    write(chunk , en , cb){
        this.emit.apply(this,["writeData",chunk,cb]);
        //console.log(chunk.toString());
        
    }

});


childInputWritableStream.addListener("newData" , (e,data) => {
    //console.log("hello world from new data");
    console.log(e,data , "emit buffer");
    childInputWritableStream.read.apply(childInputWritableStream,[10,data]);
});



childOutputReadableStream.addListener("writeData" , (e,q) => {
    console.log(e.toString() , "In Buffer");
    q();
});

function eventDataEmit(data){
    let buffer=(`print("${data}")\n`);
    console.log(buffer , "Qqq");
    childInputWritableStream.emit.apply(childInputWritableStream,["newData",null,buffer]);
}

let child = spawn("python",["-i"]);

//childInputWritableStream.pipe(child.stdin);
//child.stdout.pipe(childOutputReadableStream);
//child.stderr.pipe(childOutputReadableStream);

var newStream  = new streams.Transform({
    objectMode: true,
    transform(chunk,en,cb){
        console.log(chunk.toString());
        cb();
    }
});

var app = express();

app.use(cors());

app.use(bodyParser.json());

app.post("/" , (req , res) => {
    let newData = req.body.data;
    //eventDataEmit(newData);
    //req.readable = true;
    //console.log(req.readable);
    req.pipe(newStream);
    //res.end("qqq");
    child.stdout.pipe(res);
    child.stderr.pipe(res);
});


var server = app.listen(8081 , (e) => console.log("hello"));