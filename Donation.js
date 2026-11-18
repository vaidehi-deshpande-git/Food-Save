const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
    },

    foodName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    location: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    expiry: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
