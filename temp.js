const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const spawn  =require("child_process").spawn;
const stream = require("stream");

const child = spawn("python" , ["-i"]);

var app = express();

app.use(cors());

app.use(bodyParser.json());

var newTransform = new stream.Transform({
    objectMode: true,
    transform(chunk , en , cb){
        console.log(chunk.toString() , "Sss");
        cb();
    }
});

var newWritable = new stream.Writable({
    objectMode: true,

    write(chunk,en,cb){
        console.log(chunk.toString() , ":Aaa");
        cb();
    }
})

app.post("/" , (req , res) => {
    let newData = req.body.data;
    //eventDataEmit(newData);
    //req.readable = true;
    //console.log(req.readable);
    req.pipe(newTransform).pipe(res);
    //res.end("qqq");
    child.stdout.pipe(newWritable);
    child.stderr.pipe(res);

    newTransform.removeAllListeners();
    newWritable.removeAllListeners();
    child.stdout.removeAllListeners();
    child.stdin.removeAllListeners();

    
});

var server = app.listen(8081 , (e) => console.log("hello"));