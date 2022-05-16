import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  UserClass from '../../services/user.js';
import  ShopClass from '../../services/shop.js';


async function getUserShopDetails(userId) {
    const exists = await ShopClass.getUserShopDetails(userId);
    if(exists && exists.userFound==true)
    {
        return exists.user;
    }

    return {}
}

async function login(req, res) {
    const email = req.body.email;
    let password = req.body.password;
    const userLogObj = {email,password};
    try {
        const exists = await UserClass.checkExists(userLogObj);
        if(exists && exists.userFound==true) 
        {
            let userObj = exists.user;
            var userId = userObj._id.toString();
            var userShopDetails = await getUserShopDetails(userId);
            let isValidPassword = bcrypt.compareSync(password, userObj.password); // true
            if (isValidPassword == false) {
                res.status(400).json({
                    success: false,
                    message: "User does not exist",
                  });
                return;
            }
            const token = jwt.sign({
                data: {
                    userId: userId,
                    username: userObj.username,
                    email: userObj.email,
                    mobileNumber: userObj.mobileNumber,
                    role: userObj.restFlg,
                    shopId: userShopDetails._id
                }
            }, 'my-secret-key-0001xx01212032432', { expiresIn: '24h' });
            res.status(200).json({
                token: token,
                msg: 'LoggedIn successfully',
                data: {
                    username: userObj.username,
                    userId: userObj._id,
                    shopId: userShopDetails._id
                }
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Incorrect password",
              });
        }
    } catch(err) {
        console.log("err", err);
        res.status(500).json({
            success: false,
            message: err.message,
          });
    }
}





//MY SQL Connection
// async function getUserShopDetails(userId) {
//     let userShopDetails = await query(`select * from shops where createdBy='${userId}'`);
//     if(userShopDetails && userShopDetails.length) {
//         return userShopDetails[0];
//     } return {}
// }

// async function login(req, res) {
//     const email = req.body.email;
//     let password = req.body.password;
//     try {
//         let user = await query(`select * from users where email = '${email}'`);
//         if (user && user.length > 0) {
//             let userObj = user[0];
//             var userId = userObj._id;
//             var userShopDetails = await getUserShopDetails(userId);
//             let isValidPassword = bcrypt.compareSync(password, userObj.password); // true
//             if (isValidPassword == false) {
//                 res.status(401).json({ msg: 'Login failed' });
//                 return;
//             }
//             const token = jwt.sign({
//                 data: {
//                     userId: userId,
//                     username: userObj.username,
//                     email: userObj.email,
//                     mobileNumber: userObj.mobileNumber,
//                     role: userObj.restFlg,
//                     shopId: userShopDetails._id
//                 }
//             }, 'my-secret-key-0001xx01212032432', { expiresIn: '24h' });
//             res.status(200).json({
//                 token: token,
//                 msg: 'LoggedIn successfully',
//                 data: {
//                     username: userObj.username,
//                     userId: userObj._id,
//                     shopId: userShopDetails._id
//                 }
//             })
//         } else {
//             res.status(401).json({ msg: 'Invalid user name or password' });
//         }
//     } catch(err) {
//         console.log("@@@@ err", err);
//         res.status(400).json({ msg: 'Failed to login' });
//     }
// }

let endpoints = {
    '/login': [{
        method: 'POST',
        callbacks: [login] // last index function is always a rest function
    }]
}

export { endpoints }
