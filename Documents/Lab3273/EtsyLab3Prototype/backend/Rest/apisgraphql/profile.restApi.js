const log = console.log;
import _ from 'lodash';
import  UserClass from '../../services/user.js';
async function updateProfile(userInput) 
{
    console.log("#######",JSON.stringify(userInput));
    try {
        let userId = userInput.userId;
        console.log(userId);
        let profileData = {
            "username":userInput.username ? userInput.username : null,
            "imageUrl":userInput.imageUrl ? userInput.imageUrl : null,
            "dob":userInput.dob ? userInput.dob : null,
            "gender":userInput.gender ? userInput.gender : null,
            "address":userInput.address ? userInput.address : null,
            "city":userInput.city ? userInput.city : null,
            "state":userInput.state ? userInput.state : null,
            "country":userInput.country ? userInput.country : null,
            "about":userInput.about ? userInput.about : null,
            "email":userInput.email ? userInput.email:null,
            "phoneNo":userInput.phoneNo ? userInput.phoneNo:null 
        };
        let exists = await UserClass.editUser(profileData,userId);
        if(exists && exists.userEdited == true)
        {
            return exists;
            //return "updated";
        }else
        {
            return {msg:"Could not update User data"};
        }
    } catch (err) {
        log("Err", err);
        return { msg: "Error in updating User profile data" };
    }
};

async function getProfile(userId) 
{
    try {
        let exists = await UserClass.getUserProfile(userId);
        //user = _.get(user, '0');
        if(exists && exists.userFound==false) 
        {
            return {
                msg: 'User Does not exists'
            }
        }
        exists.user.password = undefined;
        return exists.user;
    } 
    catch(err) 
    {
        console.trace("Err", err);
        return {msg: 'Failed to get user profile'};
    }
}

export { getProfile, updateProfile };