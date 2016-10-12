const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    name: String,
    isSavings: Boolean,
    initialBalance: Number,
    currentBalance: Number,
    currency: String,
    lastReconciliation: Date,
    update: Date,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

AccountSchema.pre('save', function (next) {
    this.update = new Date();
    next();
});

module.exports = mongoose.model('Account', AccountSchema);
