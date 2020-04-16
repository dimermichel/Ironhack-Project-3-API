const { Schema, model } = require('mongoose');

const Coordinates = new Schema (
  {
    lat: Number,
    lng: Number
  }
);

const Weather = new Schema (
  {
    datetime: Date,
    temp: Number,
    max_temp: Number,
    min_temp: Number,
    iconURL: String,
    code: Number,
    description: String
  }
);

const Attractions = new Schema (
  {
    name: String,
    score: Number,
    snippet:String,
    coordinates: Coordinates,
    imgURL: String
  }
);

const TravelSchema = new Schema(
  {
    city: String,
    state_code: String,
    country_code: String,
    imgURL: String,
    coordinates: Coordinates,
    startDate: Date,
    endDate: Date,
    attractions: [Attractions],
    weather: [Weather],
    fullList: {
      type: Schema.Types.ObjectId,
      ref: 'List',
      required: [true, 'You need a list id']
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'You need an owner id']
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Travel', TravelSchema);