// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

const whitelist = ['::1'];
//192.168.1.10
const generalLimiter = rateLimit({
	windowMs: 30 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  skip: (req, res) => {
    console.log(req);
    console.log("this is the request ip = "+req.ip);
    return whitelist.includes(req.ip);
  },
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  message: 'Too many requests, please try again later.',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

const strictLimiter = rateLimit({
	windowMs: 30 * 1000, // 15 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  message: 'Too many requests, please try again later.',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.static('./public'));
app.use('/sample-get-request', strictLimiter); // Apply rate limiting to the specific route
app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
app.use('/', generalLimiter); // Apply rate limiting to all requests
app.set('view engine', 'ejs');
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
    res.render('index');
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
