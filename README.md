# Gwumpy Twumpy

Anders Bando-Hess and Chris Bertasi - September 2018

[Front-end Github](https://github.com/abandohess/trump-tweet-frontend)

[Front-end Landing Page](http://gwumpytwumpy.surge.sh/)

### Description
Gwumpy Twumpy is a service that sends you a text message when Trump tweets something grumpy. We used Twitter's API to retrieve Trump's tweets and Google's Natural Language Processing API to detect when a tweet is grumpy. Finally, we used Twilio to send text messages.

### Who did what
Andy created the API to add and remove users, and set up the Twitter API. He also built the font-end. Chris set up the Google NLP API to perform sentiment analysis, and configured Twilio to send texts to all users in the database. He also added a Tweet schema to the database so we can track how Google rated each of Trump's tweets.

### What we learned
We learned how to use Google's NLP API, Twitter's API, and TWILIO.

### What didn't work
Setting up Google NLP was fairly difficult without uploading the JSON key. After a bit of hassle we finally decided to store the JSON object as a string in a Heroku config variable, and then retrieve it and serialize it back into a JSON object in the backend.
