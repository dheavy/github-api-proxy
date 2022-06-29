"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_1 = require("../controllers/search");
const constants_1 = require("../constants");
const router = (0, express_1.Router)();
router.get('/search', search_1.search);
router.get('*', (_, res) => {
    res.status(404);
    res.send({
        data: null,
        errors: [constants_1.MSG_404_ERROR_INSTRUCTIONS]
    });
});
exports.default = router;
