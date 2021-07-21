const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ordersSchema = new Schema ({
  epos: {
    type: Schema.Types.ObjectId,
    ref: 'epos'
  },
  beverages: {
    type: [Schema.Types.ObjectId],
    ref: 'beverages'
  },
  food: {
    type: [Schema.Types.ObjectId],
    ref: 'food'
  },
  table: {
    type: Schema.Types.ObjectId,
    ref: 'tables'
  },
  table_name: {
    type: String
  },
  total_price: {
    type: Number
  },
  quantity: {
    type: [Number]
  },
  is_closed: {
    type: Boolean
  },
  order_rating: {
    type: Number
  },
  transaction_month: {
    type: String
  },
  app_order: {
    type: Boolean
  },
  transaction_time: {
    type: String
  }
});

module.exports = Orders = mongoose.model('orders', ordersSchema);