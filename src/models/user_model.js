import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  phoneNumber: { type: Number, unique: true },
}, {
  toJSON: {
    virtuals: true,
  },
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
