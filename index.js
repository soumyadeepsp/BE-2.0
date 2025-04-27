// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "soumyadeepsp@gmail.com",
    pass: "gnmugxwnklynwlkv",
  },
});

const sendEmail = async () => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Soumyadeep Paul 👻" <soumyadeepsp@gmail.com>', // sender address
    to: "soumyadeep18104@iiitd.ac.in", // list of receivers
    subject: "Hello ✔", // Subject line
    // text: "localhost:3000/user/verify?token=abc", // plain text body
    html: `<p>click <a href="http://localhost:3000/user/verify?token=abc">here</a> to verify</p>`, // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

const whitelist = ['::1'];
//192.168.1.10
const generalLimiter = rateLimit({
	windowMs: 30 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  skip: (req, res) => {
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

import { Server } from "socket.io";
import http from 'http';
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});
const port = 3000;

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    console.log(socket.id);
    socket.emit('response', 'hi from the server');
  });
});

app.use(cookieParser());
app.use(express.json());
app.use(express.static('./public'));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
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
    res.cookie('hello', 'new world');
    res.cookie('hello2', 'new world2');
    res.render('index');
});

app.get('/user/verify', (req, res) => {
  return res.render('verify');
});

app.get('/sample-get-request/:werfgrsbrtgf', (req, res) => {
    const someData = req.params.werfgrsbrtgf;
    res.send(`You sent: ${someData}`);
});

app.get('/sample-get-request', (req, res) => {
    const k1 = req.query.k1;
    const k2 = req.query.k2;
    const k3 = req.query.k3;
    res.send(`hello world`);
});

app.post('/upload-file', (req, res) => {
  console.log(req.files);
  if (req.files) {
    if (!fs.existsSync('./files')){
      fs.mkdirSync('./files');
    }
    req.files.file.mv('./files/' + req.files.file.name, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error occurred while uploading file');
      }
    });
    return res.status(200).send('File uploaded successfully');
  } else {
    return res.status(400).send('No file uploaded');
  }
});

app.get('/sendEmail', async (req, res) => {
  try {
    await sendEmail();
    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

const removeSpecialCharacters = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

const validateUserForSignUp = [
    body('username').trim().customSanitizer((value) => removeSpecialCharacters(value)).isLength({ min: 6 }).withMessage('Username must be at least 6 chars long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
];

app.post('/user/signup', validateUserForSignUp, (req, res) => {
    const errors = validationResult(req).errors;
    console.log(errors);
    if (errors.length>0) {
        return res.status(400).json({ errors });
    }
    res.send('User signed up');
});

server.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
