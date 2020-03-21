const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    // id is the response from github login
    githubId:{
      type: Number
    },
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      //required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      //required: [true, 'Password is required.']
    },
    // User's avatar image
    profileUrl: {
      type: String,
         default:
        'https://res.cloudinary.com/dimermichel/image/upload/c_thumb,h_240,r_max,w_240/v1581909162/ironhackProject2/defaut_llrjv7.png',
    },
    // User's avatar image with extra features
    profilePicUrl: {
      type: String,
      default:
        'https://res.cloudinary.com/dimermichel/image/upload/c_thumb,h_240,r_max,w_240/v1581909162/ironhackProject2/defaut_llrjv7.png',
    },
    // the code sent to user email in order to validate email authenticity
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date
    },
    // Details about which strategy was utilized
    strategy: {
      type: String
    }
  },
  {
    timestamps: true
  }
);


module.exports = model('User', userSchema);
