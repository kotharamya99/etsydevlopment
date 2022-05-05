import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please enter username"],
        maxLength:[150,"Username cannot be more than 150 Characters"]
    },
    imageUrl:{
        type:String
    },
    dob:{
        type:Date
    },
    gender:{
        type:String
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    about:{
        type:String
    },
    email:{
        type:String,
        required:[true,"Please enter email"],
        maxLength:[150,"Email cannot be more than 150 Characters"]
    },
    phoneNo:{
        type:String
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        maxLength:[150,"Password cannot be more than 150 Characters"]
    }
},
{
    versionKey: false
})


const userModel = mongoose.model('users', userSchema);
//module.exports = userModel;
export default userModel;
