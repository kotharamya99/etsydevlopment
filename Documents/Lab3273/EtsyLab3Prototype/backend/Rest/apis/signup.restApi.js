import { uuid } from 'uuidv4';
import * as bcrypt from 'bcrypt';
import  UserClass from '../../services/user.js';
var saltRounds = 10;

async function signUp(req, res) 
{
    var data = req.body;
    const username = data.username;
    const password = data.password;
    const email = data.email;
    const userRegObj = {username,email,password};

    try
    {

        const exists = await UserClass.checkExists(userRegObj);
        console.log(JSON.stringify(exists));
        if(exists && exists.userFound==true){
            res.status(401).json({ msg: 'Email already exists' });
        }else
        {
            const encryptedPassword = bcrypt.hashSync(password, saltRounds);
            userRegObj.password = encryptedPassword;
            const result = await UserClass.addUser(userRegObj);
            delete userRegObj.password;
            res.status(201).json({
                username: userRegObj.username,
                email,
                msg: 'User Created Successfully'
            })
        }

    }catch(e) 
    {
        console.log(e);
        res.status(500).json({msg: "Could not process your request, Please try again later"})
    }
}





// MySQL Connection
// function signUp(req, res) {
//     var data = req.body;
//     const userName = data.username;
//     const password = data.password;
//     const email = data.email;

//     connection.query(`select * from users where email = '${email}'`, (err, results, fields) => {
//         if (results && results.length > 0) {
//             res.status(401).json({ msg: 'Email already exists' });
//         } else {
//             const encryptedPassword = bcrypt.hashSync(password, saltRounds);
//             let newUserId = `u-${uuid()}`
//             let columns = ["_id", "username", "imageUrl", "dob", "gender", "address", "city", "state", "country", "about", "email", "phoneNo", "password"]
//             let userdetails = [newUserId, userName, null, null, null, null, null, null, null, null, email, null, encryptedPassword];
//             connection.query('INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', userdetails, (err, results, fields) => {
//                 !err ? res.json({
//                     username: userName,
//                     email,
//                     message: 'User Created Successfully'
//                 }) : res.json(err);
//             })
//         }
//     })
// }

let endpoints = {
    '/signup': [{
        method: 'POST',
        callbacks: [signUp]
    }]
}

export { endpoints }