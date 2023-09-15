const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

// to support JSON-encoded bodies
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  // Your webhook secret from Razorpay Dashboard
  const secret = 'padhae';

  // The Razorpay signature in the request header
  const signature = req.headers['x-razorpay-signature'];

  // Generate the expected signature based on the request body
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  // Check if the generated signature matches the request signature
  if (generatedSignature === signature) {
    // Extract payment ID
    const paymentId = req.body.payload.payment.entity.id;

    // Log the Payment ID
    console.log('Payment was successful. Payment ID:', paymentId);

    // TODO: Further processing, like updating database records.

    res.status(200).send('OK');
  } else {
    res.status(400).send('Invalid signature');
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
