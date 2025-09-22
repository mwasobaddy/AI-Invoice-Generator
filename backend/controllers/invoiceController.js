const Invoice = require('../models/Invoice');

// @desc    Check if invoice number exists
// @route   GET /api/invoices/exists/:invoiceNumber
// @access  Public (for form validation)
exports.checkInvoiceNumberExists = async (req, res) => {
    try {
        const { invoiceNumber } = req.params;
        const exists = await Invoice.exists({ invoiceNumber });
        res.json({ exists: !!exists });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
    try {
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billingFrom,
            billingTo,
            items,
            notes,
            paymentTerms,
            status,
            subTotal,
            taxTotal,
            total,
        } = req.body;
        
        // Data is already transformed by frontend, use directly
        const newInvoice = new Invoice({
            user: user._id,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billingFrom,
            billingTo,
            items,
            notes,
            paymentTerms,
            subTotal,
            taxTotal,
            total,
            status: status || 'unpaid',
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        console.error('Request body:', req.body);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error',
                errors: errors 
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Invoice number already exists' 
            });
        }
        
        res.status(500).json({ message: 'Server error while creating invoice' });
    }
};

// @desc    Get all invoices for a user
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id }).populate('user', 'name email');
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('user', 'name email');
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // check if the invoice belongs to the authenticated user
        if (invoice.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this invoice' });
        }
        res.json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billingFrom,
            billingTo,
            items,
            notes,
            paymentTerms,
            status, 
        } = req.body;

        // recalculate totals
        let subTotal = 0;
        let taxTotal = 0;
        if (items && items.length > 0) {
            items.forEach(item => {
                subTotal += item.quantity * item.unitPrice;
                taxTotal += (item.quantity * item.unitPrice * (item.taxRate || 0)) / 100;
            });
        }

        const total = subTotal + taxTotal;

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                invoiceDate,
                dueDate,
                billingFrom,
                billingTo,
                items,
                notes,
                paymentTerms,
                status,
                subTotal,
                taxTotal,
                total,
            },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(updatedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}; 