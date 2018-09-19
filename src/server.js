// import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Twitter from 'twitter';
import googleNLP from '@google-cloud/language';
import { sendMessageToUsers } from './controllers/user_controller';

import apiRouter from './router';

dotenv.config({ silent: true });

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/trumpTweets';
// const mongoURI = 'mongodb://localhost/blog';
mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// this should go AFTER body parser
app.use('/api', apiRouter);

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET_KEY,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET_KEY,
});

function alertUsersOfTweet() {
  const params = { screen_name: 'realDonaldTrump', count: 1 };
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      console.log(tweets[0].text);
    }
  });
}
setInterval(alertUsersOfTweet, 1 * 1000);

console.log(`listening on: ${port}`);
