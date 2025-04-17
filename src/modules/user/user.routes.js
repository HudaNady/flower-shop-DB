import { Router } from "express";
import * as user from './controller/user.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { updatePassword, updateUserSchema } from "./user.validation.js";
import roles from "../../types/roles.js";
import upload, { customValdation } from "../../middleware/multer.js";


const router=Router()
router.put('/updatePassword',authentication,authorization([roles.user,roles.admin]),validation(updatePassword),user.updatePassword)
router.put('/updateData',authentication,authorization([roles.user,roles.admin]),validation(updateUserSchema),upload(customValdation.images,'profile'),user.updateUserData)
router.get('/user',authentication,authorization([roles.user,roles.admin]),user.getUserData)
router.get('/',authentication,authorization([roles.admin]),user.getUsers)

export default router