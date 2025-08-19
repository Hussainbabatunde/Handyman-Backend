// /var/www/RestAPI/src/app.ts
import dotenv from 'dotenv';
import path from 'path';
const envResult = dotenv.config({ path: path.join(__dirname, '../.env') });

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes/routes';
const db = require('../models');
// import menuRoutes from './routes/menuRoutes';
// import { connectToDatabase } from './config/db';
// import swaggerUi from 'swagger-ui-express';
// import { specs } from './config/swagger';
// import imageRoutes from './routes/imageRoutes';


const app: Express = express();

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
// app.use('/api/images', imageRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3002;

// connect to db and start server
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  });
// if (require.main === module) {
//     connectToDatabase()
//         .then(() => {
//             app.listen(PORT, () => {
//                 console.log(`Server is running on port ${PORT}`);
//             });
//         })
//         .catch(error => {
//             console.error('Failed to start server:', error);
//             process.exit(1);
//         });
// }

export default app;