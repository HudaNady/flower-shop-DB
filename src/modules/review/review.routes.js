import { Router } from "express";
import * as review from './controller/review.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router()
router.post('/addReview',authentication,authorization([roles.user]),review.addReview)
router.get('/getAllReview',review.getAllReviews)
router.get('/:_id',review.getReviewById)
router.put('/:_id',authentication,authorization([roles.admin,roles.user]),review.updateReview)
router.delete('/:_id',authentication,authorization([roles.admin,roles.user]),review.deleteReview)

export default router