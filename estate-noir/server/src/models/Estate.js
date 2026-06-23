const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Apartment', 'House', 'Studio'],
      required: [true, 'Property type is required'],
    },
    listingType: {
      type: String,
      enum: ['For Sale', 'For Rent'],
      required: [true, 'Listing type is required'],
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one image URL is required',
      },
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Estate', estateSchema);
