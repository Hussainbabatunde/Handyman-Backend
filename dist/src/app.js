"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /var/www/RestAPI/src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envResult = dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const upload_1 = __importDefault(require("./utils/upload"));
const socket_io_1 = require("socket.io");
const chatController_1 = require("./controllers/chatController");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const db = require('../models');
const cron = require("node-cron");
const { Bookings } = require("../models"); // adjust path to your models
const { Op } = require("sequelize");
// import menuRoutes from './routes/menuRoutes';
// import { connectToDatabase } from './config/db';
// import swaggerUi from 'swagger-ui-express';
// import { specs } from './config/swagger';
// import imageRoutes from './routes/imageRoutes';
const app = (0, express_1.default)();
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1', routes_1.default);
app.use("/api/v1/upload", upload_1.default);
// app.use('/api/images', imageRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const PORT = process.env.PORT || 3002;
// Create HTTP server (needed for socket.io)
const httpServer = https_1.default.createServer({
    key: fs_1.default.readFileSync("/etc/letsencrypt/live/toolbox.com.ng/privkey.pem"),
    cert: fs_1.default.readFileSync("/etc/letsencrypt/live/toolbox.com.ng/fullchain.pem"),
}, app);
// Init Socket.IO
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" }
});
function getIO() {
    console.log("here");
    if (!io)
        throw new Error("Socket.io not initialized");
    return io;
}
getIO();
// Register chat socket handlers
io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);
    (0, chatController_1.registerChatHandler)(io, socket);
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
    .catch((err) => {
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
exports.default = app;
