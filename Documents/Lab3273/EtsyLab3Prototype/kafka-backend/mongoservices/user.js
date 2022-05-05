import mongoose from 'mongoose';
import UserModel from '../models/users.js';

export default class UserClass
{
    static checkExists = async ({email})=>
    {
        try{
            const query = {
                email
            };
            const result = await UserModel.findOne(query);
            const userObj = {};
            if(result){
                userObj.userFound = true;
                userObj.user = result;
            }else{
                userObj.userFound = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred checking exists");
        }
    }

    static addUser = async ({username, email, password})=>{
        try{
            const query = {
                username,
                email,
                password
            };
            const user = new UserModel(query);
            const result = await user.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while adding user");
        }
    }

    static getUserProfile = async (userId)=>
    {   
        try{
            const result = await UserModel.findById(userId);
            const userObj = {};
            if(result){
                userObj.userFound = true;
                userObj.user = result;
            }else{
                userObj.userFound = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred checking exists");
        }
    }

    static editUser = async (profileData,userId)=>{
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(userId)
            };
            const updateValues = {$set: profileData};
            console.log(updateValues);
            const result = await UserModel.updateOne(findCondition,updateValues);
            const userObj = {};
            if(result.acknowledged == true){
                userObj.userEdited = true;
            }else{
                userObj.userEdited = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while editing user");
        }
    }

}

//module.exports.User = User;