import conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js"; 
export const sendMessage = async (req, res) => {
    try {
        console.log("Message Request Body (before destructuring):", req.body); 

        const { message } = req.body;
        const { id: recipientId } = req.params;
        const senderId = req.user._id;

        let conversationData = await conversation.findOne({ 
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversationData) {
            conversationData = await conversation.create({ 
                participants: [senderId, recipientId],
            });
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: recipientId, 
            message: message,        
        });

        if (newMessage) {
            conversationData.messages.push(newMessage._id);
        }

        await Promise.all([conversationData.save(), newMessage.save()])

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        let conversationFound = await conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversationFound) {
            return res.status(200).json([]);
        }

        const messages = conversationFound.messages;

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};