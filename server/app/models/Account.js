const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Account', new Schema({
    name: String,
    isSavings: Boolean,
    currentBalance: Number,
    lastReconciliation: Date,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}));
