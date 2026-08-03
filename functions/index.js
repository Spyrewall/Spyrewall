/**
 * Spyrewall — Firebase Cloud Functions for Razorpay Payment Processing
 *
 * These functions handle:
 * 1. createOrder  → Creates a Razorpay order (called before opening checkout modal)
 * 2. verifyPayment → Verifies the payment signature after user completes payment
 *
 * SETUP:
 * 1. Set environment config:
 *    firebase functions:config:set razorpay.key_id="rzp_live_XXXX" razorpay.key_secret="YOUR_SECRET"
 * 2. Deploy:
 *    firebase deploy --only functions
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Razorpay = require('razorpay')
const crypto = require('crypto')

admin.initializeApp()
const db = admin.firestore()

// Initialize Razorpay with server-side credentials
const razorpay = new Razorpay({
  key_id: functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID,
  key_secret: functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET,
})

/**
 * createOrder
 * Called by the frontend to create a Razorpay order before opening the checkout modal.
 *
 * Input:  { amount: number (in INR, e.g. 2999), courseIds: string[], customerEmail: string }
 * Output: { orderId: string, amount: number (in paise), currency: string }
 */
exports.createOrder = functions.https.onCall(async (data, context) => {
  const { amount, courseIds, customerEmail, customerName } = data

  // Validate input
  if (!amount || amount <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount must be a positive number.')
  }
  if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'At least one course ID is required.')
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert INR to paise
      currency: 'INR',
      receipt: `spyrewall_${Date.now()}`,
      notes: {
        courseIds: courseIds.join(','),
        customerEmail: customerEmail || '',
        customerName: customerName || '',
      },
    })

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    }
  } catch (error) {
    console.error('Razorpay order creation failed:', error)
    throw new functions.https.HttpsError('internal', 'Unable to create payment order. Please try again.')
  }
})

/**
 * verifyPayment
 * Called after the user completes payment in the Razorpay checkout modal.
 * Verifies the HMAC signature to ensure the payment is authentic.
 *
 * Input:  { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseIds, customerInfo }
 * Output: { status: 'success', orderId: string }
 */
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseIds,
    customerName,
    customerEmail,
    customerPhone,
    amount,
  } = data

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing payment verification data.')
  }

  // Verify the signature using HMAC SHA256
  const keySecret = functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET
  const hmac = crypto.createHmac('sha256', keySecret)
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
  const generatedSignature = hmac.digest('hex')

  if (generatedSignature !== razorpay_signature) {
    console.error('Payment verification failed — signature mismatch', {
      razorpay_order_id,
      razorpay_payment_id,
    })
    throw new functions.https.HttpsError('unauthenticated', 'Payment verification failed. Invalid signature.')
  }

  // Signature is valid — save order to Firestore
  try {
    const orderDoc = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      courseIds: courseIds || [],
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      amount: amount || 0,
      currency: 'INR',
      status: 'paid',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    // Save to orders collection
    const docRef = await db.collection('orders').add(orderDoc)

    // If user is authenticated, update their purchased courses
    if (context.auth) {
      const userRef = db.collection('users').doc(context.auth.uid)
      await userRef.set(
        {
          purchasedCourses: admin.firestore.FieldValue.arrayUnion(...(courseIds || [])),
          lastPurchaseAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
    }

    return {
      status: 'success',
      orderId: docRef.id,
      paymentId: razorpay_payment_id,
    }
  } catch (error) {
    console.error('Failed to save order:', error)
    throw new functions.https.HttpsError('internal', 'Payment verified but order save failed. Contact support.')
  }
})
