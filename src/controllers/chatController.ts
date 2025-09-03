import { Op } from "sequelize";
import { Server, Socket } from "socket.io";
const { Bookings, User, Chat, Conversation } = require("../../models"); // adjust path if needed

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

  const roomId = `room_${conversation.id}`;
  socket.join(roomId);
  socket.emit("joined_room", { roomId, conversationId: conversation.id });

  console.log(`User ${userId} joined ${roomId}`);
});


    socket.on("send_message", async (data) => {
  console.log("data: ", data);
        try {
            
            const { senderId, receiverId, conversationId, content } = data;
            console.log("senderId: ", senderId);
            

            if (senderId == receiverId) {
                socket.emit("error", { message: "Cannot send message to yourself" })
                return
            }
            const receiver = User.findByPk(receiverId)
            if (!receiver) {
                socket.emit("error", { message: "Receiver not found" });
                return;
            }

            const message = Chat.create({
                senderId, receiverId, conversationId, content
            })
            io.to(`user_${receiverId}`).emit("new_message", message)
            io.to(`user_${senderId}`).emit("new_message", message)
        }
        catch (err) {
            console.error(err);
            socket.emit("error", { message: "Server error" });
        }
    })

    // Get messages in a conversation
    socket.on("get_messages", async ({ userId, otherUserId }, callback) => {
        try {
            const messages = await Chat.findAll({
                where: {
                    [Op.or]: [
                        { senderId: userId, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: userId }
                    ]
                },
                include: [
                    { model: User, as: "sender", attributes: ["id", "username"] },
                    { model: User, as: "receiver", attributes: ["id", "username"] }
                ],
                order: [["createdAt", "ASC"]]
            });

            callback(messages);
        } catch (err) {
            console.error(err);
            callback([]);
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
}