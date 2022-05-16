import express from 'express';
import cors from 'cors';
import cluster from 'cluster';
import { initRestApis } from './Rest/index.js'
import { initdb } from './init.db.js'
import { initmongodb } from './init.db.js'
import os from 'os';
import { AuthTokenMiddleWare } from './Middlewares/AuthTokenMiddleWare.js'
import { graphqlHTTP } from 'express-graphql';
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import   schema   from './graphql/schema.js';



const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

var workers = 1 || process.env.WORKERS || os.cpus().length;
const PORT = process.env.PORT || 3001
async function createServer() 
{
    process.on('unhandledRejection', (err) => {
        console.log("unhandledRejection : ", err);
    })
    process.on('uncaughtException', (err) => {
        console.log("uncaughtException : ", err);
    })
    var app = express({ mergeParams: true });
    app.use(express.static('../frontend/build'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors())
    //await initdb() --mySQL
    await initmongodb()
    await AuthTokenMiddleWare(app)
    await initRestApis(app)
    app.listen(PORT, function() {
        console.log("Server listening on port 3001");
    });


    app.use("/graphql",graphqlHTTP({
        schema,
        graphiql: true
    }));
    

}





if (cluster.isMaster) {

    console.log('start cluster with %s workers', workers);

    for (var i = 0; i < workers; ++i) {
        var worker = cluster.fork().process;
        console.log('worker %s started.', worker.pid);
    }

    cluster.on('exit', function(worker) {
        console.log('worker %s died. restart...', worker.process.pid);
        cluster.fork();
    });

} else {
    createServer()
}

//module.exports = app;




// import express from 'express';
// import cors from 'cors';
// import cluster from 'cluster';
// import { initRestApis } from './Rest/index.js'
// import { initdb } from './init.db.js'
// import { initmongodb } from './init.db.js'
// import os from 'os';
// import { AuthTokenMiddleWare } from './Middlewares/AuthTokenMiddleWare.js'

// import path from 'path'
// import fs from 'fs'
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(
//     import.meta.url);
// const __dirname = path.dirname(__filename);

// var workers = process.env.WORKERS || os.cpus().length;
// const PORT = process.env.PORT || 3001
// async function createServer() {
//     process.on('unhandledRejection', (err) => {
//         console.log("unhandledRejection : ", err);
//     })
//     process.on('uncaughtException', (err) => {
//         console.log("uncaughtException : ", err);
//     })
//     var app = express({ mergeParams: true });
//     app.use(express.static('../frontend/build'))
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: false }));
//     app.use(cors())
//     //await initdb() --mySQL
//     await initmongodb()
//     await AuthTokenMiddleWare(app)
//     await initRestApis(app)
//     app.listen(PORT, function() {
//         console.log("Server listening on port 3001");
//     });

// }

// if (cluster.isMaster) {

//     console.log('start cluster with %s workers', workers);

//     for (var i = 0; i < workers; ++i) {
//         var worker = cluster.fork().process;
//         console.log('worker %s started.', worker.pid);
//     }

//     cluster.on('exit', function(worker) {
//         console.log('worker %s died. restart...', worker.process.pid);
//         cluster.fork();
//     });

// } else {
//     createServer()
// }

//exports default app;



// import express from 'express';
// import cors from 'cors';
// import cluster from 'cluster';
// import { initRestApis } from './Rest/index.js'
// import { initdb } from './init.db.js'
// import os from 'os';
// import { AuthTokenMiddleWare } from './Middlewares/AuthTokenMiddleWare.js'
// import kafka from './kafka/client.js';
// import initMongoDB from './db.mongo/index.js'
// import { readFileSync } from 'fs';

// import path from 'path'
// import fs from 'fs'
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// var workers = 1 || process.env.WORKERS || os.cpus().length;
// const PORT = process.env.PORT || 3001
// // async function createServer() {
//     global.myrequests= {}
//     process.on('unhandledRejection', (err) => {
//         console.log("unhandledRejection : ", err);
//     })
//     process.on('uncaughtException', (err) => {
//         console.log("uncaughtException : ", err);
//     })
//     var app = express({ mergeParams: true });
//     app.use(express.static('../frontend/build'))
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: false }));
//     app.use(cors())
//     const config = JSON.parse(readFileSync(new URL('./config.json', import.meta.url)));
//     global.config = config
//     // await initdb()
//     console.log("####", config)
//     global.ModelFactory = await initMongoDB()
//     global.kafka = kafka
//     await AuthTokenMiddleWare(app)
//     await initRestApis(app)
//     app.listen(PORT, function() {
//         console.log("Server listening on port 3001");
//     });

// // }



// // if (cluster.isMaster) {

// //     console.log('start cluster with %s workers', workers);

// //     for (var i = 0; i < workers; ++i) {
// //         var worker = cluster.fork().process;
// //         console.log('worker %s started.', worker.pid);
// //     }

// //     cluster.on('exit', function(worker) {
// //         console.log('worker %s died. restart...', worker.process.pid);
// //         cluster.fork();
// //     });

// // } else {
//     // createServer()
// // }

// export default app;