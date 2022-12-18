"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sign_up_controller_1 = require("./sign-up.controller");
const router = (0, express_1.Router)();
router.get('/sign-up', sign_up_controller_1.showSignUpForm);
router.post('/sign-up', sign_up_controller_1.signUpHandler);
exports.default = router;
