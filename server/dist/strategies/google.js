"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: '108993774108-a0fr57u7e14pfn2k8b95as8hg5mbqjrs.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3001/api/auth/google/redirect',
    scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ],
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Access Token:', accessToken);
    console.log('Profile:', profile);
    done(null, { username: profile.displayName, accessToken });
}));
exports.default = passport_1.default;
