import express from 'express';
import MYENV from './config/app-env';
import './config/database';
import appMiddlewares from './config/middleware';
import appRoutes from './modules/index';


const app = express();

appMiddlewares(app);
appRoutes(app);

app.listen(MYENV.PORT, () => {
    console.log(`App listining on port ${MYENV.PORT} `);
});