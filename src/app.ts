// /var/www/RestAPI/src/app.ts
import dotenv from 'dotenv';
import path from 'path';
const envResult = dotenv.config({ path: path.join(__dirname, '../.env') });

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes/routes';
import uploadRouter from './utils/upload';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerChatHandler } from './controllers/chatController';
import https from "https";
import fs from "fs"
const db = require('../models');
const cron = require("node-cron");
const { Bookings } = require("../models"); // adjust path to your models
const { Op } = require("sequelize");
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
app.use("/api/v1/upload", uploadRouter);
// app.use('/api/images', imageRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3002;

// Create HTTP server (needed for socket.io)
const httpServer = https.createServer({
  key: fs.readFileSync("/etc/letsencrypt/live/toolbox.com.ng/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/toolbox.com.ng/fullchain.pem"),
}, app);

// Init Socket.IO
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

function getIO() {
  console.log("here")
  if (!io) throw new Error("Socket.io not initialized")
  return io;
}

getIO()

// Register chat socket handlers
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);
  registerChatHandler(io, socket);
});


// connect to db and start server
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
    // Runs every day at 23:59 (11:59 PM)
    // cron.schedule("59 23 * * *", async () => {
    //   try {
    //     console.log("Running booking expiration job...");

    //     const today = new Date();
    //     const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    //     // Find all bookings with status still pending and scheduled today
    //     const bookingsToExpire = await Bookings.findAll({
    //       where: {
    //         status: "pending",
    //         scheduledAt: {
    //           [Op.lte]: endOfDay, // expired if it's today or earlier
    //         },
    //       },
    //     });

    //     if (bookingsToExpire.length > 0) {
    //       await Bookings.update(
    //         { status: "expired" },
    //         {
    //           where: {
    //             id: bookingsToExpire.map((b: any) => b.id),
    //           },
    //         }
    //       );

    //       console.log(`Expired ${bookingsToExpire.length} bookings`);
    //     } else {
    //       console.log("No bookings to expire today.");
    //     }
    //   } catch (err) {
    //     console.error("Error running booking expiration job:", err);
    //   }
    // });

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