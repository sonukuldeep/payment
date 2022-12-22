require("dotenv").config()

const express = require("express")
const cors = require("cors")

//init port number
const PORT = process.env.PORT || 5000

// init express
const app = express()

// allwed address
const url = process.env.CLIENT_URL

//middleware
app.use(express.json())
app.use(
  cors({
    origin: url,
  })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])


// routes
app.get("/", (req,res)=>{
    res.status(200).send("hello world")
})


app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {name: storeItem.name},
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    })
    res.status(200).json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post("/*", (req,res)=>{
  res.send("ok")
})
// listen
app.listen(PORT, (console.log(`Server running on port ${PORT}`)))


// This is your test secret API key.
// const stripe = require('stripe')('sk_test_51MH7dVSBGD3BBl5hlaXkEDpydnKCjRtuqMqezTPcf3O50GmhUHxr52RGuk1hMKh8Y7p9MFeiQKeohBqVGhkqMkZJ00Gyu4wpkm');
// const express = require('express');
// const app = express();
// app.use(express.static('public'));

// const YOUR_DOMAIN = 'http://localhost:4242';

// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: '{{PRICE_ID}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}/success.html`,
//     cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//   });

//   res.redirect(303, session.url);
// });

// app.listen(4242, () => console.log('Running on port 4242'));