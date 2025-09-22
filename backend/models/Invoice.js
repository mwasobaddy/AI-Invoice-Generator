// model 
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    taxPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
});

const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    invoiceDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    billingFrom: {
        businessName: { type: String, required: true }, 
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    billingTo: {
        clientName: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [itemSchema],
    notes: {
        type: String,
        default: ''
    },
    paymentTerms: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    subTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
