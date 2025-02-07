"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("next/server");
const prisma = new client_1.PrismaClient();
async function POST(req) {
    try {
        // Parse request body
        const { email, password } = await req.json();
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return server_1.NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return server_1.NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        // Create a JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        // Return success response with token
        return server_1.NextResponse.json({ message: "Login successful", token });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
