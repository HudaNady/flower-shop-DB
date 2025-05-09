import { Router } from "express";
import * as product from './controller/product.controller.js'
import { addProductSchema } from "./product.validation.js";
import validation from "../../middleware/validation.js";
import upload, { customValdation } from "../../middleware/multer.js";
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router({mergeParams:true})
router.post('/addProduct',authentication,authorization([roles.admin]),upload(customValdation.images,'product'),validation(addProductSchema),product.addProduct)
router.get('/all',product.getAllProducts)
router.get('/',product.getAllProductsInCatecory)
router.get('/:_id',product.getProductById)
router.put('/:_id',authentication,authorization([roles.admin]),upload(customValdation.images,'product'),product.updateProduct)
router.delete('/:_id',authentication,authorization([roles.admin]),product.deleteProduct)


export default router