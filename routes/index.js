const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers.js')
// catch errors is functional composition, wrapping fn into a fn
// req is data that comes in
// res is data that comes out

// Do work here
// router.get('/', storeController.homePage);
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/reverse/:name', (req, res) => {
  console.log(req.params.name);
  res.send('it works');

})

module.exports = router;
