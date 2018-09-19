import Twitter from 'twitter';
import googleNLP from '@google-cloud/language';
import { sendMessageToUsers } from './user_controller';
import TweetModel from '../models/tweet_model';

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET_KEY,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET_KEY,
});

// Instantiates a new google NLP client
const googleClient = new googleNLP.LanguageServiceClient({
  credentials: JSON.parse(process.env.NLP_API_KEY),
  project_id: 'memur-208402',
});


function analyzeTweet(tweet) {
  const document = {
    content: tweet.text,
    type: 'PLAIN_TEXT',
  };
  googleClient.analyzeSentiment({ document }).then((results) => {
    const sentiment = results[0].documentSentiment;
    if (sentiment.score <= -0.5) {
      console.log('Twumpy is vewy gwumpy!');
      console.log(`Sentiment score: ${sentiment.score}`);
      sendMessageToUsers('Twumpy is vewy gwumpy!');
    } else if (sentiment.score < 0) {
      console.log('Twumpy is gwumpy!');
      console.log(`Sentiment score: ${sentiment.score}`);
      sendMessageToUsers('Twumpy is gwumpy!');
    } else {
      console.log('Trump is not grumpy!');
    }
    console.log(tweet.text);
    const newTweet = new TweetModel();
    newTweet.id = tweet.id;
    newTweet.text = tweet.text;
    newTweet.created_at = tweet.created_at;
    newTweet.sentiment_score = sentiment.score;
    newTweet.sentiment_magnitude = sentiment.magnitude;
    newTweet.save()
      .catch((err) => {
        console.error('Error', err);
      });
  })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

const checkMostRecentTweet = () => {
  const params = { screen_name: 'realDonaldTrump', count: 1 };
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      TweetModel.findOne({ id: tweets[0].id }).then((result) => {
        if (result != null) {
          console.log('No new tweets');
        } else {
          analyzeTweet(tweets[0]);
        }
      });
    } else {
      console.log(`Error: ${error}`);
    }
  });
};

export { checkMostRecentTweet as default };
