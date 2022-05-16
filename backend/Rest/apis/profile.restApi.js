const log = console.log;
import _ from 'lodash';
import  UserClass from '../../services/user.js';
//import {make_request} from '../../kafka/client.js'
async function updateProfile(req, res) {
    
    // const msg = {};
    // msg.userId = req.params.userId;
    // msg.path = "update_profile";
    // msg.body = req.body;
    // make_request('profile_topic',msg, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if (err){
    //         console.log("Inside err"+err);
    //         res.json({
    //             status:"error",
    //             msg:"System Error, Try Again."
    //         })
    //     }else{
    //         console.log("Inside else");
    //             res.status(200).json(results);

    //             res.end();
    //         }
        
    // });


    try {
        let userId = req.params.userId;
        let profileData = {
            "username":req.body.username ? req.body.username : null,
            "imageUrl":req.body.imageUrl ? req.body.imageUrl : null,
            "dob":req.body.dob ? req.body.dob : null,
            "gender":req.body.gender ? req.body.gender : null,
            "address":req.body.address ? req.body.address : null,
            "city":req.body.city ? req.body.city : null,
            "state":req.body.state ? req.body.state : null,
            "country":req.body.country ? req.body.country : null,
            "about":req.body.about ? req.body.about : null,
            "email":req.body.email ? req.body.email:null,
            "phoneNo":req.body.phoneNo ? req.body.phoneNo:null 
        };
        let exists = await UserClass.editUser(profileData,userId);
        if(exists && exists.userEdited == true)
        {
            res.status(200).json(exists);
        }else
        {
            res.status(400).json({msg:"Could not update User data"});
        }
    } catch (err) {
        log("Err", err);
        res.status(400).json({ msg: "Error in updating User profile data" });
    }
};

async function getProfile(req, res) 
{
    let userId = req.params.userId;
    try {
        let exists = await UserClass.getUserProfile(userId);
        //user = _.get(user, '0');
        if(exists && exists.userFound==false) {
            return res.status(400).json({
                msg: 'User Does not exists'
            })
        }
        exists.user.password = undefined;
        res.status(200).json(exists.user)
    } catch(err) {
        console.trace("Err", err);
        res.status(400).json({msg: 'Failed to get user profile'})
    }
    // const msg = {};
    // msg.userId = req.params.userId;
    // msg.path = "get_profile";
    // make_request('profile_topic',msg, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if (err){
    //         console.log("Inside err"+err);
    //         res.json({
    //             status:"error",
    //             msg:"System Error, Try Again."
    //         })
    //     }else{
    //         console.log("Inside else");
    //             res.json(results);

    //             res.end();
    //         }
        
    // });
}

//MY SQL Conn
// async function updateProfile(req, res) {
//     try {
//         let profileData = [
//             req.body.username ? req.body.username : null,
//             req.body.imageUrl ? req.body.imageUrl : null,
//             req.body.dob ? req.body.dob : null,
//             req.body.gender ? req.body.gender : null,
//             req.body.address ? req.body.address : null,
//             req.body.city ? req.body.city : null,
//             req.body.state ? req.body.state : null,
//             req.body.country ? req.body.country : null,
//             req.body.about ? req.body.about : null,
//             req.body.phoneNo?req.body.phoneNo:null 
//         ];

//         let results = await query(
//             `update users set username=?, imageUrl=?, dob=?, gender=?, address=?, city= ?, state=?, country=?, about= ?, phoneNo=? where _id='${req.params.userId}'`,
//             profileData
//         );
//         res.status(200).json(results);
//     } catch (err) {
//         log("err ===>", err);
//         res.status(400).json({ msg: "Error in updating profile data" });
//         return;
//     }
// };

// async function getProfile(req, res) {
//     let userId = req.params.userId;
//     try {
//         let user = await query(`select * from users where _id='${userId}'`);
//         user = _.get(user, '0');
//         if(!user) {
//             return res.status(400).json({
//                 msg: 'User not exists'
//             })
//         }
//         delete user.password;
//         res.status(200).json(user)
//     } catch(err) {
//         console.trace("#### err", err);
//         res.status(400).json({msg: 'Failed to get user profile'})
//     }
// }

let endpoints = {
    "/users/:userId/profile": [{
        method: "PUT",
        callbacks: [updateProfile],
    },
    {
        method: "GET",
        callbacks: [getProfile],
    }
 ],
};



export { endpoints };