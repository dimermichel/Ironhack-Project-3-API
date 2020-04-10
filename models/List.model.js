const { Schema, model } = require('mongoose');

const Element = new Schema({
  name: String,
  quantity: Number,
  checked: Boolean
});

var List = new Schema({
  title: String,
  items: [Element],
  type: String,
  completed: Boolean
});

const ListSchema = new Schema(
  {
    lists: [List],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'You need an owner id'],
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('List', ListSchema);