"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getZodErrorMessage = (error) => {
    return error.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
    }));
};
exports.default = getZodErrorMessage;
