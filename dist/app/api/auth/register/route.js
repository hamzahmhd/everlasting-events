"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const server_1 = require("next/server");
const prisma = new client_1.PrismaClient();
async function POST(req) {
    const { name, email, password } = await req.json();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return server_1.NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });
    return server_1.NextResponse.json({ message: "User created successfully", user: newUser });
}
