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
  videoAccess: {
    type: Boolean,
    default: false,
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
      //   isVisible: {
      //     type: Boolean,
      //     default: false,
      //   },
      lockDate: {
        type: String,
      },
    },
  ],
  questions: [
    {
      suffix: {
        type: String,
      },
      qId: {
        type: Number,
      },
      qText: {
        type: String,
      },
      ansType: {
        type: String,
      },
      link: {
        type: String,
      },
      description: {
        type: String,
      },
      shipType: {
        type: String,
      },
      vIq: {
        type: String,
      },
      qParent: {
        type: String,
      },
    },
  ],
  blockedQuestions: [
    {
      qId: {
        type: Number,
      },
    },
  ],
});

module.exports = User = mongoose.model("user", userSchema);
