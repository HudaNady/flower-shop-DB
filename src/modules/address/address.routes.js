
import { Router } from "express";
import * as address from './controller/address.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";
import validation from "../../middleware/validation.js";
import { addressSchema } from "./address.validation.js";



const router=Router()
router.post('/',authentication,authorization([roles.user]),validation(addressSchema),address.addAddress)
router.get('/',authentication,address.getAllAddresses)
router.delete('/:_id',authentication,authorization([roles.user]),address.deleteAddress)


export default router