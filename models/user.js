const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+@.+\..+/, "Must match an email address"]
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: "thought"
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: "user"
    }]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length
});

const user = model('user', userSchema);

module.exports = user;