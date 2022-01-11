const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: Number,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  position: {
    type: Number,
  },
  shipType: {
    type: Number,
  },
  organisation: {
    type: String,
  },
  futImpl1: {
    type: String,
  },
  futImpl2: {
    type: String,
  },
  futImpl3: {
    type: String,
  },
  roles: [
    {
      role: {
        type: Number,
      },
      isAllowed: {
        type: Boolean,
      },
    },
  ],
  currentInspection: {
    shipType: {
      type: Number,
    },
    shipName: {
      type: String,
    },
  },
  createdDate: {
    type: String,
  },
  modifiedDate: {
    type: String,
  },
  acl: [
    {
      _id: false,
      sectionId: {
        type: Number,
      },
      sectionName: {
        type: String,
      },
      isVisible: {
        type: Boolean,
        default: false,
      },
      unlockDate: {
        type: String,
      },
    },
  ],
});

module.exports = User = mongoose.model("user", userSchema);
