"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycController = void 0;
const { User, Kyc } = require("../../models"); // adjust path if needed
const kycController = async (req, res) => {
    try {
        const { documents } = req.body;
        const user = req.user;
        if (!Array.isArray(documents)) {
            return res.status(400).json({ error: "documents must be an array" });
        }
        console.log("documents: ", documents);
        // Bulk insert into DB
        // Attach userId to each document
        const docsWithUser = documents.map(doc => ({
            ...doc,
            userId: user?.id,
        }));
        // Bulk insert
        const savedDocs = await Kyc.bulkCreate(docsWithUser);
        // Update only completedKyc
        await User.update({ completedKyc: true }, { where: { id: user?.id } });
        return res.status(201).json({ message: 'Kyc submitted successfully.', data: savedDocs });
    }
    catch (error) {
        console.error("Error kyc controller:", error);
        return res.status(400).json({ message: error.message });
    }
};
exports.kycController = kycController;
