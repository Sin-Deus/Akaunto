const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OperationSchema = new Schema({
    description: String,
    type: String,
    amount: Number,
    isChecked: Boolean,
    isReconciled: Boolean,
    date: Date,
    month: Number,
    update: Date,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    }
});

OperationSchema.index({ account: 1, month: -1 });

OperationSchema.pre('save', function (next) {
    this.update = new Date();
    next();
});

module.exports = mongoose.model('Operation', OperationSchema);
