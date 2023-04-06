"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                status: "error",
                message: error.message
            });
        }
        next(error);
    }
};
exports.validate = validate;
