"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './.env' });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = __importDefault(require("./routes/auth"));
require('./strategies/google');
const app = (0, express_1.default)();
app.use(passport_1.default.initialize());
app.use('/api/auth', auth_1.default);
exports.default = app;
