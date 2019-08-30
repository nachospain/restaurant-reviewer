const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// Using built in es6 promise
const slug = require('slugs');
// Allow us to make url friendly names
// this is the schema for the db
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    // delete whitespace
    required: 'Enter a store...'
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
       type: Number,
       required: 'Supply coordinates'
    }],
    address: {
      type: String,
      required: 'You must supply a valid address'
    }
  }
  // tags: an array of strings, so [] array of Strings : [String]
});

// Logic before mongo saves the data, we create a regular function so that we can use -this- referring to the model.
// this.slug will equal slug() to slugisify the name.
storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next(); //skiip it
    return; //stop func from running
  }
  this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model('Store', storeSchema);

// Make sure you import your models in start.js
