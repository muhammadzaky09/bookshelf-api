import Hapi from '@hapi/hapi';
import routes from './routes.js';

import dotenv from 'dotenv';

dotenv.config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
          },
    });
    
    server.route(routes);
    
    await server.start();
    console.log(`Server running on ${server.info.uri}` );
}
init();





