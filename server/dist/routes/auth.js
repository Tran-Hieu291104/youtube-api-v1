"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', {
    scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ]
}));
router.get('/google/redirect', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    const { accessToken } = req.user;
    res.redirect(`http://localhost:3001?token=${accessToken}`);
});
exports.default = router;
