import { uuid } from 'uuidv4';
import * as bcrypt from 'bcrypt';
import  UserClass from '../../services/user.js';
var saltRounds = 10;

async function signUp(body) 
{
    var data = body;
    const username = data.username;
    const password = data.password;
    const email = data.email;
    const userRegObj = {username,email,password};

    try
    {

        const exists = await UserClass.checkExists(userRegObj);
        console.log(JSON.stringify(exists));
        if(exists && exists.userFound==true){
            return { msg: 'Email already exists' };
        }else
        {
            const encryptedPassword = bcrypt.hashSync(password, saltRounds);
            userRegObj.password = encryptedPassword;
            const result = await UserClass.addUser(userRegObj);
            delete userRegObj.password;
            return {
                username: userRegObj.username,
                email,
                msg: 'User Created Successfully'
            }
        }

    }catch(e) 
    {
        console.log(e);
        return {msg: "Could not process your request, Please try again later"}
    }
}




export { signUp }