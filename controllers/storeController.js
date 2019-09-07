const mongoose = require('mongoose');
// Now we need to reference the Store model but because we already imported it
// globally on start.js we can just call it as a variable
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({message: 'That file is not an image'}, false);
    }
  },
}




exports.homePage = (req, res) => {
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if no file to resize
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
}

exports.createStore = async ( req, res ) => {
  const store = await (new Store(req.body).save());
  console.log('It worked');
  req.flash('success', `Succesfully created ${store.name}`);
  res.redirect(`/store/${store.slug}`);
  // res.json(req.body);
}

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  console.log(stores);
  res.render('stores', {title: 'Stores', stores});
}

exports.editStore = async (req, res) => {
  // find store with
  // confirm if user is owner of store to delete
  // render form
  const store = await Store.findOne({ _id: req.params.id })
  res.render('editStore', { title: `Edit ${store.name}`, store: store });
}

exports.updateStore = async (req, res) => {
  // find store and update
  // const store = await Store.findOneAndUpdate( query, data, options)
  const store = await Store.findOneAndUpdate( { _id: req.params.id }, req.body, {
    new: true, //by default it returns the old data, with this it returns the new one
    runValidators: true, // run the required fields again, by default only on creation
  }).exec();
  req.flash('success', `Succesfully updated <strong>${store.name}</strong>.
  <a href="/stores/${store.slug}">Visit the store 🤪</a>`);
  // redirect to stores
  res.redirect(`/stores/${store._id}/edit`);

}

exports.getStoreBySlug = async (req, res) => {
  const store = await Store.findOne({slug: req.params.slug});
  if (!store) return next();
  res.render('store', { store });
}



// if you do not want to use composition to handle errors on routes,
// you can also wrap your logic in a try {}, and then catch() {}, although
// this slightly defeats the purpose of using async, await
// exports.createStore = async ( req, res ) => {
//   try {
//     const store = new Store(req.body);
//     await store.save()
//     res.redirect('/');
//   } catch(err) {
//     console.log(err);
//   }
// }
