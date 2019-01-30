const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    body: {
        type: String,
        required: true
    },
    approvedComment: {
        type: Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('comments', CommentSchema);