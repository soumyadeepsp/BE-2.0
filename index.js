// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
const port = 3000;

app.use(cookieParser());

// events-demo.js
import EventEmitter from 'events';

// Create an instance(objects)
const eventEmitter = new EventEmitter();

// Define a listener (creating an event)
eventEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Emit the event
eventEmitter.emit('greet', 'Alice');

app.get('/', (req, res) => {
    console.log(req.cookies);
    res.cookie('hello', 'new world');
    res.cookie('hello2', 'new world2');
    res.send('Hello from Express!');
});

app.get('/sample-get-request/:werfgrsbrtgf', (req, res) => {
    const someData = req.params.werfgrsbrtgf;
    res.send(`You sent: ${someData}`);
});

app.get('/sample-get-request', (req, res) => {
    const k1 = req.query.k1;
    const k2 = req.query.k2;
    const k3 = req.query.k3;
    console.log(`k1: ${k1}, k2: ${k2}, k3: ${k3}`);
    res.send(`hello world`);
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
