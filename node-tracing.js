/*
#    Copyright 2017 Google Inc.
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        https://www.apache.org/licenses/LICENSE-2.0

#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
*/
// trace agent
require('@google-cloud/trace-agent').start({
    projectId: 'ygrinshteyn-sandbox'
  });

// grpc stuff
var protobuf = require('protobufs');
var PROTO_PATH = __dirname + '/helloworld.proto'
console.log("proto path: " + PROTO_PATH)
var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).helloworld;
console.log("hello_proto: " + hello_proto)


const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log('Inbound request received!');
    
    // make grpc call to grpc server - localhost on port 50051
    var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
    var user;
    if (process.argv.length >= 3) {
        user = process.argv[2];
        console.log("user is " + user);
    } else {
        user = 'world';
    }
    client.sayHello({name: user}, function(err, response) {
        if (err){
            console.log("could not connect to grpc server");
        }
        console.log('Greeting:', response.message);
        res.send("grpc response is " + response.message);
    
        });
    });

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running at http://127.0.0.1:8080/");
  console.log('Press Ctrl+C to quit.');
});