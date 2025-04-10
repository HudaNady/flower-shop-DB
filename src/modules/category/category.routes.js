import { Router } from "express";
import * as category from './controller/category.controller.js'
import upload, { customValdation } from "../../middleware/multer.js";
import validation from "../../middleware/validation.js";
import { addCategorySchema } from "./category.validation.js";
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";
import productRouter from '../product/product.routes.js'



const router=Router()

router.post('/addCategory',authentication,authorization([roles.admin]),upload(customValdation.images,'category'),validation(addCategorySchema),category.addCategory)
router.get('/',category.getAllCategories)
router.get('/:_id',category.getCategoryById)
router.put('/:_id',authentication,authorization([roles.admin]),upload(customValdation.images,'category'),category.updateCategory)
router.delete('/:_id',authentication,authorization([roles.admin]),category.deleteCategory)
.use('/:_id/products',productRouter)

export default router