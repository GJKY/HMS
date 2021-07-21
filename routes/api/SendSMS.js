const express = require('express');
const router = express.Router();
const accountSid = 'AC9304d9dc5363bec89a2223b6db5ea18c';
const authToken = '634cf1957b849c47b8ff081f214b09e1';
const client = require('twilio')(accountSid, authToken);

router.post('/messages', (req, res) => {
  console.log('Here!')

  client.messages
    .create({
      from: '+447588740958',
      to: '+447581711583',
      body: 'NEW ORDER!'
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

module.exports = router;