"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const stream_1 = require("stream");
const router = (0, express_1.Router)();
router.post('/upload', async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const file = req.files?.video; // Kiểu dữ liệu cho file
        if (!file) {
            return res.status(400).json({ error: 'No video file provided' });
        }
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No access token provided' });
        }
        // Bước 1: Upload file video
        const FormData = require('form-data');
        const formData = new FormData();
        const stream = stream_1.Readable.from(file.data);
        formData.append('video', stream, file.name);
        const uploadResponse = await axios_1.default.post('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=media', file.data, // Gửi raw buffer
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': file.mimetype,
                'Content-Length': file.size,
            },
        });
        const videoId = uploadResponse.data.id;
        // Bước 2: Cập nhật metadata
        const metadata = {
            id: videoId,
            snippet: {
                title: title || 'Untitled Video',
                description: description || '',
                tags: tags && tags.length > 0 ? tags : undefined,
                categoryId: '22', // People & Blogs
            },
            status: {
                privacyStatus: 'private',
            },
        };
        const updateResponse = await axios_1.default.put('https://www.googleapis.com/youtube/v3/videos?part=snippet,status', metadata, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        res.json(updateResponse.data);
    }
    catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        res.status(500).json({ error: error.message || 'Failed to upload video' });
    }
});
exports.default = router;
