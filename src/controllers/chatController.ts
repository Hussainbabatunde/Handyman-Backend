import { Op } from "sequelize";
import { Server, Socket } from "socket.io";
const { Bookings, User, Chat, Conversation } = require("../../models"); // adjust path if needed

// Global storage for users and socket mappings
const users = new Map<string, any>();          // userId -> user object
const socketToUser = new Map<string, string>(); // socketId -> userId


export const registerChatHandler = (io: Server, socket: Socket) => {
    console.log("user connected inside: ", socket?.id);

    // join room for personal chatting
    socket.on("join", async ({ userId, otherUserId }) => {
        // check if conversation exists
        console.log("userId: ", userId, " otherUserId: ", otherUserId);
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: userId, user2Id: otherUserId },
                    { user1Id: otherUserId, user2Id: userId },
                ],
            },
        });


        if (!conversation) {
            conversation = await Conversation.create({
                user1Id: userId,
                user2Id: otherUserId,
            });
        }

        const roomId = conversation.id;
        socket.join(roomId);
        socket.emit("joined_room", { roomId, conversationId: conversation.id });

        console.log(`User ${userId} joined ${roomId}`);
    });


    socket.on("send_message", async (data) => {
        console.log("data: ", data);
        try {

            const { senderId, receiverId, conversationId, content } = data;


            if (senderId == receiverId) {
                socket.emit("error", { message: "Cannot send message to yourself" })
                return
            }
            const receiver = await User.findByPk(receiverId)
            if (!receiver) {
                socket.emit("error", { message: "Receiver not found" });
                return;
            }

            const message = await Chat.create({
                senderId, receiverId, conversationId, content
            })
            // Emit to everyone in the conversation room
            const roomId = conversationId;
            console.log("message: ", message);
            
            io.to(roomId).emit("new_message", message);
        }
        catch (err) {
            console.error(err);
            socket.emit("error", { message: "Server error" });
        }
    })

    // Get messages in a conversation
    socket.on("get_messages", async ({ conversationId }) => {
        try {
            const messages = await Chat.findAll({
                where: { conversationId },
                order: [["createdAt", "ASC"]],
            });

            socket.emit("get_messages_response", messages);
        } catch (err) {
            console.error(err);
            socket.emit("get_messages_response", []);
        }
    });


    // Get chat list (unique users + last message)
    socket.on("get_chats", async (userId: number, callback) => {
        try {
            const chats = await Chat.findAll({
                where: {
                    [Op.or]: [{ senderId: userId }, { receiverId: userId }]
                },
                include: [
                    { model: User, as: "sender", attributes: ["id", "username"] },
                    { model: User, as: "receiver", attributes: ["id", "username"] }
                ],
                order: [["createdAt", "DESC"]]
            });

            const uniqueUsers = new Map();
            chats.forEach((chat: any) => {
                const otherUser = chat.senderId === userId ? chat.receiver : chat.sender;
                if (otherUser && !uniqueUsers.has(otherUser.id)) {
                    uniqueUsers.set(otherUser.id, {
                        user: otherUser,
                        lastMessage: chat.content,
                        timestamp: chat.createdAt,
                    });
                }
            });

            callback(Array.from(uniqueUsers.values()));
        } catch (err) {
            console.error(err);
            callback([]);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    // ===== WEBRTC CALLING HANDLERS =====

    // Register user for calling
    socket.on("register-for-calls", (data: { userId: string; userName: string }) => {
        const { userId, userName } = data;
        const user = {
            id: userId,
            name: userName,
            socketId: socket.id,
            isAvailableForCalls: true,
        };

        users.set(userId, user);
        socketToUser.set(socket.id, userId);

        console.log(`User ${userName} registered for calls`);

        socket.emit("user-registered-for-calls", { userId, userName });
    });

    // Handle call initiation
    socket.on("make-call", (data: { targetUserId: string; offer: any; callerName: string }) => {
        const { targetUserId, offer } = data;
        const callerId = socketToUser.get(socket.id);

        if (!callerId) {
            socket.emit("call-error", { message: "User not registered" });
            return;
        }

        const caller = users.get(callerId);
        const target = users.get(targetUserId);

        if (!caller || !target) {
            socket.emit("call-error", { message: "Target user not found or offline" });
            return;
        }

        console.log(`WebRTC call initiated: ${caller.name} -> ${target.name}`);

        io.to(target.socketId).emit("incoming-call", {
            callerId: caller.id,
            callerName: caller.name,
            offer,
        });
    });

    // Handle call answer
    socket.on("answer-call", (data: { targetUserId: string; answer: any }) => {
        const { targetUserId, answer } = data;
        const target = users.get(targetUserId);

        if (!target) {
            socket.emit("call-error", { message: "Caller not found" });
            return;
        }

        const answererUserId: any = socketToUser.get(socket.id);
        const answerer = users.get(answererUserId);

        console.log(`Call answered: ${answerer?.name} answered ${target.name}'s call`);

        io.to(target.socketId).emit("call-answered", { answer });
    });

    // Handle call rejection
    socket.on("reject-call", (data: { targetUserId: string }) => {
        const { targetUserId } = data;
        const target = users.get(targetUserId);

        if (!target) {
            socket.emit("call-error", { message: "Caller not found" });
            return;
        }

        const rejecterUserId: any = socketToUser.get(socket.id);
        const rejecter = users.get(rejecterUserId);

        console.log(`Call rejected: ${rejecter?.name} rejected ${target.name}'s call`);

        io.to(target.socketId).emit("call-rejected");
    });

    // Handle call end
    socket.on("end-call", (data: { targetUserId: string }) => {
        const { targetUserId } = data;
        const target = users.get(targetUserId);

        if (!target) {
            socket.emit("call-error", { message: "Target user not found" });
            return;
        }

        const enderUserId: any = socketToUser.get(socket.id);
        const ender = users.get(enderUserId);

        console.log(`Call ended by: ${ender?.name}`);

        io.to(target.socketId).emit("call-ended");
    });

    // Handle ICE candidate exchange
    socket.on("ice-candidate", (data: { candidate: any; targetUserId: string }) => {
        const { candidate, targetUserId } = data;
        const target = users.get(targetUserId);

        if (!target) {
            socket.emit("call-error", { message: "Target user not found" });
            return;
        }

        io.to(target.socketId).emit("ice-candidate", { candidate });
    });

    // Check availability
    socket.on("check-call-availability", (data: { targetUserId: string }) => {
        const { targetUserId } = data;
        const target = users.get(targetUserId);

        const isAvailable = target && target.isAvailableForCalls;

        socket.emit("call-availability-response", {
            targetUserId,
            isAvailable,
            isOnline: !!target,
        });
    });

    // Set availability
    socket.on("set-call-availability", (data: { isAvailable: boolean }) => {
        const { isAvailable } = data;
        const userId = socketToUser.get(socket.id);

        if (userId && users.has(userId)) {
            const user = users.get(userId);
            user.isAvailableForCalls = isAvailable;
            users.set(userId, user);

            console.log(`User ${user.name} set call availability to: ${isAvailable}`);
        }
    });

    // ===== DISCONNECT HANDLER (extend your existing one) =====
    socket.on("disconnect", () => {
        const userId = socketToUser.get(socket.id);

        if (userId) {
            const user = users.get(userId);
            console.log(`User disconnected: ${user?.name || "Unknown"} (${userId})`);

            // Notify others in case user was in a call
            if (user) {
                users.forEach((otherUser, otherUserId) => {
                    if (otherUserId !== userId) {
                        io.to(otherUser.socketId).emit("call-ended");
                    }
                });
            }

            users.delete(userId);
            socketToUser.delete(socket.id);

            socket.broadcast.emit("user-offline", userId);
        }

        console.log("Socket disconnected:", socket.id);
    });
}