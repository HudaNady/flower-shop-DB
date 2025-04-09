import { Router } from "express";
import * as wishList from './controller/wishList.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";



const router=Router()
router.post('/',authentication,authorization([roles.user]),wishList.addWishList)
router.get('/',authentication,authorization([roles.user]),wishList.getWishList)
router.delete('/:id',authentication,authorization([roles.user]),wishList.deleteFromWishList)


export default router