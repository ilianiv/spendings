var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title : 'Spendings app',
    partials : {
      layout : 'layout'
    }
  });
});

/* GET add spending page. */
router.get('/add', function(req, res) {
  res.render('add', {
    title : 'Add new spending',
    fields : [
      {'field' : 'amount'},
      {'field' : 'name'},
      {'field' : 'date'}
    ],
    partials : {
      layout : 'layout'
    }
  });
});

/* POST add spending page. */
router.post('/add', function(req, res) { 
  /* TO DO */
  res.redirect('/add');
});

module.exports = router;
