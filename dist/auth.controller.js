"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signupController = void 0;
const auth_service_1 = require("./auth.service");
const signupController = async (req, res) => {
    try {
        const result = await (0, auth_service_1.signupService)(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.signupController = signupController;
const loginController = async (req, res) => {
    try {
        const result = await (0, auth_service_1.loginService)(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
exports.loginController = loginController;
//# sourceMappingURL=auth.controller.js.map