import { Router } from "express";
import * as auth from './controller/auth.controller.js'
import validation from "../../middleware/validation.js";
import { confirmEmailSchema, forgotpassSchema, loginSchema, resetPasswordSchema, signUpSchema } from "./auth.validation.js";


const router=Router()
router.post('/signUp',validation(signUpSchema),auth.signUp)
router.post('/signIn',validation(loginSchema),auth.login)
router.post('/forgotPass',validation(forgotpassSchema),auth.forgotpass)
router.post('/verifyResetCode',validation(confirmEmailSchema),auth.verifyResetCode)
router.put('/resetPassword',validation(resetPasswordSchema),auth.resetPassword)

export default router