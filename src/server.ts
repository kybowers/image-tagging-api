import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import app from './app';

// const https = require('https');
// const createHttpsCreadentials = require('./utils/createHttpsCredentials');

const port = process.env.PORT || 3000;
// const httpsPort = process.env.PORT || 8100;

app.listen(port, () => console.log(`Listening on port ${port}`));
// const server = https
//     .createServer(createHttpsCreadentials(), app)
//     .listen(httpsPort, () =>
//         console.log(`Https Listening on port ${httpsPort}`)
//     );

// server.on('error', onError);
// server.on('listening', onListening);

// const onError = (error: Error) => {
//     if (error.sescall !== 'listen') {
//         throw error;
//     }

//     switch (error.code) {
//         case 'EACCES':
//             console.error(`Port ${port} requires elecated privileges`);
//             process.exit(1);
//             break;
//         case 'EADDRINUSE':
//             console.error(`Port ${port} is already in use`);
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// };
