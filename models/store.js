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
  },
  photo: String
  // tags: an array of strings, so [] array of Strings : [String]
});

// Logic before mongo saves the data, we create a regular function so that we can use -this- referring to the model.
// this.slug will equal slug() to slugisify the name.
storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); //skiip it
    return; //stop func from running
  }
  this.slug = slug(this.name);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: {$sum: 1} } },
    { $sort: { count: -1 } }
  ])
};

module.exports = mongoose.model('Store', storeSchema);

// Make sure you import your models in start.js
