const mongoose = require('mongoose');
const moment = require('moment');
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
        ref: 'User',
        required: true
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
});

OperationSchema.index({ account: 1, month: -1 });

OperationSchema.pre('save', function (next) {
    this.update = new Date();
    this.month = moment(this.date).format('YYYYMM');
    next();
});

module.exports = mongoose.model('Operation', OperationSchema);
