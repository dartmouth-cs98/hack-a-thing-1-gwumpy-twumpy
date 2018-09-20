import dotenv from 'dotenv';
import Twilio from 'twilio';
import UserModel from '../models/user_model';

dotenv.config({ silent: true });
const accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTHTOKEN; // Your Auth Token from www.twilio.com/console
const client = new Twilio(accountSid, authToken);

function sendWelcome(number) {
  client.messages.create({
    body: 'Welcome to Gwumpy Twumpy! You will now receive updates whenever Trump is in a grumpy mood!',
    to: `+1${number}`, // Text this number
    from: '+19149082922', // From a valid Twilio number
  })
    .then((message) => { return console.log(message.sid); });
}

function sendGoodbye(number) {
  client.messages.create({
    body: 'You have unsubscribed from Gwumpy Twumpy. You will no longer receive updates whenever Trump is in a grumpy mood.',
    to: `+1${number}`, // Text this number
    from: '+19149082922', // From a valid Twilio number
  })
    .then((message) => { return console.log(message.sid); });
}

function sendMessage(number, text) {
  client.messages.create({
    body: text,
    to: `+1${number}`, // Text this number
    from: '+19149082922', // From a valid Twilio number
  })
    .then((message) => { return console.log(message.sid); });
}

export const createUser = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;

  if (!phoneNumber) {
    return res.status(422).send('You must provide a phone number');
  }

  UserModel.findOne({ phoneNumber }).then((result) => {
    if (result != null) {
      res.send('User already exists\n');
    } else {
      const newUser = new UserModel();
      newUser.phoneNumber = phoneNumber;
      newUser.save()
        .then((beep) => {
          res.send(beep);
          sendWelcome(phoneNumber);
          console.log(`Created user with number ${phoneNumber}`);
        })
        .catch((boop) => {
          res.status(500).json({ boop });
        });
    }
  });
};

export const deleteUser = (req, res, next) => {
  const phoneNumber = req.query.phoneNumber;

  if (!phoneNumber) {
    return res.status(422).send('You must provide a phone number');
  }

  UserModel.deleteOne({ phoneNumber }, (err) => {
    if (err) {
      res.send(`Encountered error while deleting phone number${phoneNumber}\n`);
    } else {
      res.send('Successfully deleted phone number\n');
      console.log(`Deleted user with number ${phoneNumber}`);
      sendGoodbye(phoneNumber);
    }
  });
};

export const sendMessageToUsers = (message) => {
  UserModel.find({})
    .then((result) => {
      result.forEach((user) => {
        // send text to user.phoneNumber
        sendMessage(user.phoneNumber, message);
        console.log(user);
      });
    })
    .catch((error) => {
      console.log('error', error);
    });
};
