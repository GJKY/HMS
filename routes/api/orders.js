const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Orders & Epos Model
const Orders = require('../../models/Orders');
const Epos = require('../../models/Epos');
const Tables = require('../../models/Tables');
const Food = require('../../models/Food');
const Beverages = require('../../models/Beverages');

//  @route  POST api/orders/create
//  @desc   Create orders.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const eposID = mongoose.Types.ObjectId(body.eposID);
  const tableID = mongoose.Types.ObjectId(body.tableID);

  const selectedFood = body.food
  const selectedDrinks = body.beverages
  var drinkID = []
  var foodID = []
  var qty = []

  var j
  for (j = 0; j < selectedDrinks.length; j++) {
    drinkID.push(selectedDrinks[j].id)
    qty.push(selectedDrinks[j].qty)
  }

  var i
  for (i = 0; i < selectedFood.length; i++) {
    foodID.push(selectedFood[i].id)
    qty.push(selectedFood[i].qty)
  }

  var k
  for (k = 0; k < selectedFood.length; k++) {
    Food.findOneAndUpdate({ _id: selectedFood[k].id }, {
      $inc: {number_in_stock: - selectedFood[k].qty, number_sold: + selectedFood[k].qty
      }}).then((error, result) => {
      if (error){

      }
    })
  }

  var l
  for (l = 0; l < selectedDrinks.length; l++) {
    Beverages.findOneAndUpdate({ _id: selectedDrinks[l].id }, {
      $inc: {number_in_stock: - selectedDrinks[l].qty, number_sold: + selectedDrinks[l].qty
      }}).then((error, result) => {
      if (error){

      }
    })
  }

  const orders = {
    _id: mongoose.Types.ObjectId(),
    beverages: drinkID,
    food: foodID,
    table: tableID,
    table_name: body.tableName,
    total_price: body.totalPrice,
    epos: eposID,
    quantity: qty,
    is_closed: false,
    transaction_month: body.transactionMonth
  }

  if (body.amendedOrder) {
    Orders.findByIdAndDelete({ _id: body.amendedOrder }).then((error, result) => {
      if (error){
  
      }
    });
  }

  Orders.create(orders, (error, response) => {
    if (error) {
      
    }
  });


  Epos.findOneAndUpdate({ _id: eposID }, {
    $push: {
      orders: orders._id
    }}).then((error, result) => {
      if (error){
        
      }
  });

  res.status(200).send({ success: true })

});

//  @route  POST api/orders/appcreate
//  @desc   Create app orders.
//  @access Public
router.post('/appcreate', (req, res) => {

  const { body } = req

  const selectedFood = body.food
  const selectedDrinks = body.beverages
  var drinkID = []
  var foodID = []
  var qty = []

  var j
  for (j = 0; j < selectedDrinks.length; j++) {
    drinkID.push(selectedDrinks[j].id)
    qty.push(selectedDrinks[j].qty)
  }

  var i
  for (i = 0; i < selectedFood.length; i++) {
    foodID.push(selectedFood[i].id)
    qty.push(selectedFood[i].qty)
  }

  var k
  for (k = 0; k < selectedFood.length; k++) {
    Food.findOneAndUpdate({ _id: selectedFood[k].id }, {
      $inc: {number_in_stock: - selectedFood[k].qty, number_sold: + selectedFood[k].qty
      }}).then((error, result) => {
      if (error){

      }
    })
  }

  var l
  for (l = 0; l < selectedDrinks.length; l++) {
    Beverages.findOneAndUpdate({ _id: selectedDrinks[l].id }, {
      $inc: {number_in_stock: - selectedDrinks[l].qty, number_sold: + selectedDrinks[l].qty
      }}).then((error, result) => {
      if (error){

      }
    })
  }

  const orders = {
    _id: mongoose.Types.ObjectId(),
    beverages: drinkID,
    food: foodID,
    table_name: body.tableName,
    total_price: body.totalPrice,
    quantity: qty,
    is_closed: true,
    app_order: true,
    transaction_time: body.transactionTime
  }

  Orders.create(orders, (error, response) => {
    if (error) {
      
    }
  });

  res.status(200).send({ success: true })

});

//  @route  GET api/orders/all
//  @desc   Return all orders.
//  @access Public
router.get('/all', (req, res) => {

  Orders.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/orders/allapp
//  @desc   Return all app orders.
//  @access Public
router.get('/allapp', (req, res) => {

  Orders.find({ app_order: true }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/orders/amendquantity
//  @desc   Amend food & bev quantities
//  @access Public
router.post('/amendquantity', (req, res) => {

  const { body } = req

  const selectedFood = body.food
  const selectedDrinks = body.beverages

  var k
  for (k = 0; k < selectedFood.length; k++) {
    Food.findOneAndUpdate({ _id: selectedFood[k].id }, {
      $inc: {number_in_stock: + selectedFood[k].qty, number_sold: - selectedFood[k].qty
      }}).then((error, result) => {
      if (error){

      }
    })
  }

  var l
  for (l = 0; l < selectedDrinks.length; l++) {
    Beverages.findOneAndUpdate({ _id: selectedDrinks[l].id }, {
      $inc: {number_in_stock: + selectedDrinks[l].qty, number_sold: - selectedDrinks[l].qty
      }}).then((error, result) => {
      if (error){

      }
    })
  }

})

//  @route  POST api/orders/byepos
//  @desc   Return all orders by epos.
//  @access Public
router.post('/byepos', (req, res) => {

  const { body } = req

  const eposID = mongoose.Types.ObjectId(body.eposID);

  Orders.find({ $and: [{ epos: eposID }, { is_closed: false }]  }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/orders/report
//  @desc   Returns report data by epos and month
//  @access Public
router.post('/reports', (req, res) => {

  const { body } = req

  const eposID = mongoose.Types.ObjectId(body.revenue)

  Orders.find({ $and: [{ epos: eposID }, { transaction_month: body.month }] }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  })
})

//  @route  POST api/orders/closedbyepos
//  @desc   Return all closed orders by epos.
//  @access Public
router.post('/closedbyepos', (req, res) => {

  const { body } = req

  const eposID = mongoose.Types.ObjectId(body.eposID);

  Orders.find({ $and: [{ epos: eposID }, { is_closed: true }]  }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/orders/id
//  @desc   Return all order details by id.
//  @access Public
router.post('/id', (req, res) => {

  const { body } = req

  const orderID = mongoose.Types.ObjectId(body.orderID);

  Orders.find({ _id: orderID }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/orders/status
//  @desc   Prepare to move order to closed orders collection.
//  @access Public
router.post('/status', (req, res) => {

  const { body } = req

  const orderID = mongoose.Types.ObjectId(body.orderID);

  Orders.findByIdAndUpdate({ _id: orderID }, {
    $set: {
      is_closed: true,
      order_rating: body.orderRating
    }}).then((error, result) => {
    if (error){

    }
  }); 

});


//  @route  DELETE api/orders/remove
//  @desc   Remove orders by ID.
//  @access Public
router.post('/remove', (req, res) => {

  const { body } = req

  const orderID = mongoose.Types.ObjectId(body.orderID);
  const eposID = mongoose.Types.ObjectId(body.eposID);

  Epos.findOneAndUpdate({ _id: eposID }, {
    $pull: {
      orders: orderID
    }}).then((error, result) => {
      if (error){
        
      }
    });

  Orders.findByIdAndDelete({ _id: orderID }).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

//  @route   POST api/orders/amend
//  @desc    Amend orders by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const ordersID = mongoose.Types.ObjectId(body.ordersID);
  const tableID = mongoose.Types.ObjectId(body.tableID);
  const oldEposID = mongoose.Types.ObjectId(body.oldEposID);
  const newEposID = mongoose.Types.ObjectId(body.newEposID);

  Epos.findOneAndUpdate({ _id: oldEposID }, {
    $pull: {
      orders: ordersID
    }}).then((error, result) => {
      if (error){
        
      }
    });

    Epos.findOneAndUpdate({ _id: newEposID }, {
      $push: {
        orders: ordersID
      }}).then((error, result) => {
        if (error){
          
        }
      });

  Orders.findByIdAndUpdate({ _id: ordersID }, {
    $set: {
      table: tableID,
      epos: newEposID
    }}).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

module.exports = router;