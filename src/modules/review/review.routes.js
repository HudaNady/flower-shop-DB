import { Router } from "express";
import * as review from './controller/review.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router()
router.post('/',authentication,authorization([roles.user]),review.addReview)
router.get('/',review.getAllReviews)
router.get('/:_id',review.getReviewsForProduct)
router.put('/:_id',authentication,authorization([roles.user]),review.updateReview)
router.delete('/:_id',authentication,authorization([roles.admin]),review.deleteReview)

export default router