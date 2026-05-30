"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.signupService = void 0;
const db_1 = __importDefault(require("./config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupService = async (data) => {
    const { name, email, password, role } = data;
    const existingUser = await db_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const result = await db_1.default.query(`
    INSERT INTO users
    (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING
    id,
    name,
    email,
    role,
    created_at,
    updated_at
    `, [
        name,
        email,
        hashedPassword,
        role || "contributor",
    ]);
    return result.rows[0];
};
exports.signupService = signupService;
const loginService = async (data) => {
    const { email, password } = data;
    const result = await db_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordMatched = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid email or password");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        name: user.name,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },
    };
};
exports.loginService = loginService;
//# sourceMappingURL=auth.service.js.map