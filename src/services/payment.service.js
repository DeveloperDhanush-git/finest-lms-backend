const mongoose = require("mongoose");

const crypto =
    require("crypto");

const Enrollment =
    require("../models/enrollment.model");

const razorpay = require("../config/razorpay");

const Cart = require("../models/cart.model");
const Payment = require("../models/payment.model");

const createCheckout = async (
    userId
) => {

    /*
    -----------------------------
    Fetch Cart
    -----------------------------
    */

    const cart =
        await Cart.findOne({
            studentId: userId,
        }).populate(
            "items.courseId",
            "title price discountPrice status isDeleted"
        );

    if (
        !cart ||
        cart.items.length === 0
    ) {

        throw new Error(
            "Cart is empty."
        );

    }

    /*
    -----------------------------
    Validate Courses
    -----------------------------
    */

    let amount = 0;

    const purchasedCourses = [];

    for (const item of cart.items) {

        const course = item.courseId;

        /*
        ---------------------------------
        Course Validation
        ---------------------------------
        */

        if (
            !course ||
            course.isDeleted ||
            course.status !== "published"
        ) {

            throw new Error(
                "One or more courses are unavailable."
            );

        }

        /*
        ---------------------------------
        Already Purchased?
        ---------------------------------
        */

        const alreadyEnrolled =
            await Enrollment.findOne({

                studentId: userId,

                courseId: course._id,

                status: "active",

            });

        if (alreadyEnrolled) {

            throw new Error(
                `You already own "${course.title}".`
            );

        }

        /*
        ---------------------------------
        Amount
        ---------------------------------
        */

        /*
    ---------------------------------
    Always Use Latest Course Price
    ---------------------------------
    */

        const latestPrice =

            course.discountPrice > 0
                ? course.discountPrice
                : course.price;

        amount += latestPrice;

        purchasedCourses.push({

            courseId:
                course._id,

            title:
                course.title,

            price:
                latestPrice,

        });

    }

    /*
    -----------------------------
    Razorpay Order
    -----------------------------
    */

    const razorpayOrder =
        await razorpay.orders.create({

            amount:
                amount * 100,

            currency:
                "INR",

            receipt:
                crypto.randomUUID(),

        });

    /*
    -----------------------------
    Save Payment
    -----------------------------
    */

    const payment =
        await Payment.create({

            studentId:
                userId,

            courses:
                purchasedCourses,

            amount,

            currency:
                "INR",

            razorpayOrderId:
                razorpayOrder.id,

        });

    /*
    -----------------------------
    Response
    -----------------------------
    */

    return {

        payment,

        razorpayOrder,

    };

};
const completePayment = async (
    payment,
    paymentId,
    signature
) => {

    const session =
        await mongoose.startSession();

    try {

        session.startTransaction();

        payment.status = "paid";
        payment.razorpayPaymentId = paymentId;
        payment.razorpaySignature = signature;
        payment.paidAt = new Date();

        await payment.save({
            session,
        });

        for (const course of payment.courses) {

            const exists =
                await Enrollment.findOne({

                    studentId:
                        payment.studentId,

                    courseId:
                        course.courseId,

                    status:
                        "active",

                }).session(session);

            if (!exists) {

                await Enrollment.create(
                    [
                        {
                            studentId:
                                payment.studentId,

                            courseId:
                                course.courseId,

                            paymentId:
                                payment._id,

                            amountPaid:
                                course.price,

                            status:
                                "active",
                        },
                    ],
                    {
                        session,
                    }
                );

            }

        }

        await Cart.findOneAndUpdate(
            {
                studentId:
                    payment.studentId,
            },
            {
                items: [],
                totalItems: 0,
                totalAmount: 0,
            },
            {
                session,
            }
        );

        await session.commitTransaction();

    }

    catch (error) {

        await session.abortTransaction();

        throw error;

    }

    finally {

        await session.endSession();

    }

    await payment.populate(
        "courses.courseId",
        "title thumbnail"
    );

    return payment;

};

const verifyPayment = async (

    userId,

    paymentData

) => {

    const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

    } = paymentData;

    /*
    -----------------------------
    Find Payment
    -----------------------------
    */

    const payment =
        await Payment.findOne({

            studentId:
                userId,

            razorpayOrderId:
                razorpay_order_id,

        });

    if (!payment) {

        throw new Error(
            "Payment not found."
        );

    }

    /*
    -----------------------------
    Already Paid?
    -----------------------------
    */

    if (
        payment.status ===
        "paid"
    ) {

        return payment;

    }

    /*
    -----------------------------
    Verify Signature
    -----------------------------
    */

    const expectedSignature =
        crypto
            .createHmac(

                "sha256",

                process.env
                    .RAZORPAY_KEY_SECRET

            )

            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )

            .digest("hex");

    if (
        expectedSignature !==
        razorpay_signature
    ) {

        payment.status =
            "failed";

        payment.failureReason =
            "Invalid Signature";

        await payment.save();

        throw new Error(
            "Payment verification failed."
        );

    }

    return await completePayment(
        payment,
        razorpay_payment_id,
        razorpay_signature
    );

};

const getPaymentHistory = async (
    userId
) => {

    return await Payment.find({

        studentId: userId,

    })

        .populate({

            path: "courses.courseId",

            select:
                "title thumbnail instructorId",

            populate: {

                path: "instructorId",

                select:
                    "displayName",

            },

        })

        .sort({

            createdAt: -1,

        });

};

const getPaymentById = async (

    paymentId,

    userId

) => {

    const payment =
        await Payment.findOne({

            _id: paymentId,

            studentId: userId,

        })

            .populate({

                path: "courses.courseId",

                select:
                    "title thumbnail instructorId",

                populate: {

                    path:
                        "instructorId",

                    select:
                        "displayName",

                },

            });

    if (!payment) {

        throw new Error(
            "Payment not found."
        );

    }

    return {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paidAt: payment.paidAt,
        orderId: payment.razorpayOrderId,
        paymentId: payment.razorpayPaymentId,
        courses: payment.courses,
    };

};

const handleWebhook = async (
    headers,
    body
) => {

    const signature =
        headers["x-razorpay-signature"];

    const expected =
        crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_WEBHOOK_SECRET
            )
            .update(body)
            .digest("hex");

    if (signature !== expected) {

        throw new Error(
            "Invalid webhook signature."
        );

    }

    const payload =
        JSON.parse(body);

    switch (payload.event) {

        case "payment.captured": {

            const entity =
                payload.payload.payment.entity;

            const payment =
                await Payment.findOne({

                    razorpayOrderId:
                        entity.order_id,

                });

            if (!payment) {

                return;

            }

            if (
                payment.status ===
                "paid"
            ) {

                return;

            }

            await completePayment(

                payment,

                entity.id,

                signature

            );

            break;

        }

        case "payment.failed": {

            const entity =
                payload.payload.payment.entity;

            await Payment.findOneAndUpdate(

                {

                    razorpayOrderId:
                        entity.order_id,

                },

                {

                    status:
                        "failed",

                    failureReason:
                        entity.error_description ||
                        "Payment Failed",

                }

            );

            break;

        }

        default:

            console.log(
                "Webhook:",
                payload.event
            );

    }

};

module.exports = {

    createCheckout,

    verifyPayment,

    getPaymentHistory,

    getPaymentById,

    handleWebhook,

};