const mongoose = require('mongoose');
const UserDataSchema = new mongoose.Schema({
    name: {type: String, 
        required: true },
    email:{type:String},
    password:{type:String},
    data:{
        type:Date,
        default:Date.now
    },
 
});
const UserData = mongoose.model('UserData', UserDataSchema);

module.exports = UserData;
