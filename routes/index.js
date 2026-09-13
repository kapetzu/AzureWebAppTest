var express = require('express');
var router = express.Router();

const { requireLogin, requireAdmin } = require('../middleware/auth');
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db');

/* GET home page. */
router.get('/', requireLogin, async function(req, res, next) {
  try {
    const db = getDatabase();

    const products = await db
      .collection('products')
      .find({})
      .toArray();

    res.render('index', {
      products: products,
      user: req.session.user,
      error: null
    });
  } catch (error) {
    console.error('Database unavailable:', error);

    res.render('index', {
      products: [],
      user: req.session.user,
      error: 'Database connection failed'
    });
  }
});

router.post('/products', requireAdmin, async function(req, res, next) {
  try {
    const db = getDatabase();

    const product = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price)
    };

    await db.collection('products').insertOne(product);

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/products/:id', requireAdmin, async function(req, res, next) {
  try {
    const db = getDatabase();

    await db.collection('products').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;