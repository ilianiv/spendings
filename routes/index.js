var express = require('express')
  , router = express.Router()
  , SpendingsHandler = require('./spendings')
  , contentHandler = new SpendingsHandler();

/* GET home page. */
router.get('/', contentHandler.displayHome);

/* GET add spending page. */
router.get('/add', contentHandler.displayAddNew);

/* POST add spending page. */
router.post('/add', contentHandler.handleAddNew);

/* GET view spendings page. */
router.get('/view/:id?', contentHandler.displayViewAll);

/* POST remove spendings page. */
router.post('/remove', contentHandler.handleRemove);

/* GET Sign up page */
router.get('/signup', contentHandler.displaySignup);

/* POST Sign up page */
router.post('/signup', contentHandler.handleSignup);

module.exports = router;
