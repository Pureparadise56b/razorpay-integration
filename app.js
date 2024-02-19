import express from 'express'
import { makePayment, verifyOrder } from './util/razorpay.util.js'

const app = express()

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', './public')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/order', async (req, res) => {
  const { amount } = req.body

  const orderDetails = await makePayment(amount)
  res.status(200).json({
    success: true,
    amount,
    orderDetails,
    key: process.env.RAZORPAY_KEY_ID,
  })
})

app.post('/order-done', (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body
  const isVarifiedOrder = verifyOrder(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET
  )

  if (isVarifiedOrder) {
    res.json({ success: true, varifiedOrder: true })
  } else {
    res.json({ success: false, varifiedOrder: false })
    // throw Error('Unverified payment')
  }
})

export { app }
