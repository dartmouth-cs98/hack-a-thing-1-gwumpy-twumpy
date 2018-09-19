import dotenv from 'dotenv';
import UserModel from '../models/user_model';

dotenv.config({ silent: true });

export const createUser = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;

  if (!phoneNumber) {
    return res.status(422).send('You must provide a phone number');
  }

  UserModel.findOne({ phoneNumber }).then((result) => {
    if (result != null) {
      res.status(420).send('User already exists\n');
    } else {
      const newUser = new UserModel();
      newUser.phoneNumber = phoneNumber;
      newUser.save()
        .then((beep) => {
          res.send(beep);
        })
        .catch((boop) => {
          res.status(500).json({ boop });
        });
    }
  });
};

export const deleteUser = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;

  if (!phoneNumber) {
    return res.status(422).send('You must provide a phone number');
  }

  UserModel.deleteOne({ phoneNumber }, (err) => {
    if (err) {
      res.send(`Encountered error while deleting phone number${phoneNumber}\n`);
    } else {
      res.send(`Successfully deleted phone number${phoneNumber}\n`);
    }
  });
};

export const sendMessageToUsers = (message) => {
  UserModel.find({})
    .then((result) => {
      result.forEach((user) => {
        // send text to user.phoneNumber
        console.log(user);
      });
    })
    .catch((error) => {
      console.log('error', error);
    });
};
