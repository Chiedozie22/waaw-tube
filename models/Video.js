const mongoose = require('mongoose');
const {schema} = mongoose;

const userSchema = new Schema({
   
    title: {
        type: String
    }, 

    videoLink: {
        type: String,
    },

    imageLink: {
        type: String,
    },

    description: {
        type: String,
    },

    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
}, {timestamps: true});

const User = mongoose.model('video', videoSchema);

module.exports = Video;