import { Router } from "express";
import * as order from './controller/order.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router()

router.post('/',authentication,authorization([roles.user]),order.addOrder)
router.get('/user',authentication,authorization([roles.user]),order.getUserOrders)
router.get('/',authentication,authorization([roles.admin]),order.getAllOrders)
router.put('/:_id',authentication,authorization([roles.admin]),order.updateStatus)


export default router