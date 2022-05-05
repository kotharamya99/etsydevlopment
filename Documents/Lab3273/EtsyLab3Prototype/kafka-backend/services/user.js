import  UserClass from '../mongoservices/user.js';
async function getProfile(msg, callback)
{
    let userId = msg.userId;
    console.log(msg);
    try {
        let exists = await UserClass.getUserProfile(userId);
        if(exists && exists.userFound==false) {
            callback(null, 'User Does not exists');
        }
        exists.user.password = undefined;
        callback(null, exists.user);
    } catch(err) {
        callback(err, null);
    }
}

async function updateProfile(msg, callback)
{
        try {
        let userId = msg.userId;
        let body = msg.body;
        let profileData = {
            "username":body.username ? body.username : null,
            "imageUrl":body.imageUrl ? body.imageUrl : null,
            "dob":body.dob ? body.dob : null,
            "gender":body.gender ? body.gender : null,
            "address":body.address ? body.address : null,
            "city":body.city ? body.city : null,
            "state":body.state ? body.state : null,
            "country":body.country ? body.country : null,
            "about":body.about ? body.about : null,
            "email":body.email ? body.email:null,
            "phoneNo":body.phoneNo ? body.phoneNo:null 
        };
        
        let exists = await UserClass.editUser(profileData,userId);
        if(exists && exists.userEdited == true)
        {
            callback(null, exists);
        }else
        {
            callback(null, "Could not update User data");
        }
    } catch (err) {
        console.log("Err", err);
        callback(null,  "Error in updating User profile data");
    }
}


async function handle_request_User(msg, callback)
{
    if (msg.path === "get_profile") {
        getProfile(msg, callback);
      }else if (msg.path === "update_profile") 
      {
        updateProfile(msg, callback);
      }
      
        
};

export {handle_request_User};


