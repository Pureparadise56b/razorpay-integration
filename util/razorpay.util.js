import Razorpay from 'razorpay'
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js'

const makePayment = async (amount = 0) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'order_rcptid_11',
    }

    const order = await instance.orders.create(options)
    return order
  } catch (error) {
    console.error("Error:: Order can't create", error)
    return null
  }
}

const verifyOrder = (order_id, payment_id, signature, secret) => {
  try {
    return validatePaymentVerification(
      {
        order_id,
        payment_id,
      },
      signature,
      secret
    )
  } catch (error) {
    console.error(error)
    return null
  }
}

export { makePayment, verifyOrder }
