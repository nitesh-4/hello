const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const open = require('open');  // Add this line to include the open module

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const secret = 'padhae';
  const signature = req.headers['x-razorpay-signature'];
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (generatedSignature === signature) {
    const paymentId = req.body.payload.payment.entity.id;
    console.log('Payment was successful. Payment ID:', paymentId);
    res.status(200).send('OK');
  } else {
    res.status(400).send('Invalid signature');
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
  open('http://localhost:3000');  // Add this line to automatically open the web browser
});
