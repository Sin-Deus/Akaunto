const mongoose = require('mongoose');
const _ = require('lodash');
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
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

AccountSchema.pre('save', function (next) {
    this.update = new Date();
    next();
});

AccountSchema.methods.isAllowedUser = function (userId) {
    return this.creator.equals(userId) || _.some(this.users, user => user.equals(userId));
};

module.exports = mongoose.model('Account', AccountSchema);
