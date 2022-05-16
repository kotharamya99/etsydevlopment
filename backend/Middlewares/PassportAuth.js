import jwt from 'jsonwebtoken';
// import {secret} from "../config.json"
const secret = "my-secret-key-0001xx01212032432";
import passport from 'passport';
import {Strategy, ExtractJwt} from "passport-jwt"
// import { userModel } from "../db.mongo/ModelConfig/users.js";
import multer from "multer";
import path from "path";
import {
    fileURLToPath
} from "url";

let excludeURLS = ['products'];

// function verifyToken(req, res, next) {
//     let urlPostFix = req.url.split('/').pop();

//     if (excludeURLS.includes(urlPostFix)) {
//         next();
//         return;
//     }
//     const tokenHeader = req.headers.authorization;
//     if (tokenHeader) {
//         try {
//             let decoded = jwt.verify(tokenHeader, secret);//'my-secret-key-0001xx01212032432');
//             let userId = req.params.userId;
//             if (userId == decoded.data.userId) {
//                 next();
//             } else {
//                 console.log("Invalid userId found");
//                 res.status(401).json({ msg: 'Unauthorized!' });
//             }
//         } catch (err) {
//             console.log(err)
//             res.status(400).json({ msg: 'Server error', err });
//         }
//     } else {
//         res.status(401).json({ msg: 'Unauthorized!' });
//     }
// }

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Directory name is", __dirname);

const upload = multer({
    dest:  __dirname + "/../public/uploads/"
});

function auth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };

    passport.use(
        new Strategy(opts, (jwt_payload, callback) => {
            const user_id = jwt_payload._id;
            // console.log("user id is", user_id);
            var usersInstance = ModelFactory.getUserInstance()
            // userModel
            usersInstance.findOne(user_id, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(null, results);
                }
                else {
                    callback(null, false);
                }
            });
        })
    )
}




const headers = (req, res, next) => {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
}

// function checkAuth(req, res, next) {
//     let urlPostFix = req.url.split('/').pop();

//     if (excludeURLS.includes(urlPostFix)) {
//         next();
//         return;
//     }
//     passport.authenticate("jwt", { session: false , failureRedirect: '/login'});
//     console.log("pp ",     passport.authenticate("jwt", { session: false, failureRedirect: '/login' }));
//     if(passport.authenticate("jwt", { session: false , failureRedirect: '/login'}) != undefined)
//         next();
// }

function checkAuth() { 
    return passport.authenticate("jwt", { session: false});
}

function AuthTokenMiddleWare(app) {
    let callback = app.use.bind(app);
    callback('/login', headers)
    callback('/users/:userId', headers)
    callback('/users/:userId', checkAuth());//passport.authenticate("jwt", { session: false }));//verifyToken); // middleware for all apis with prefix '/users' 
    callback('/upload', upload.single('myImage'));
}


export { AuthTokenMiddleWare, auth }
// exports.auth = auth;
// exports.checkAuth = Passport.authenticate("jwt", { session: false });