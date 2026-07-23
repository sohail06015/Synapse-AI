import express from 'express';
import { generateArticle, generateBlogTitle, generateImage, getPublicImages, getUserCreations, removeImageBackground, resumeReview, toggleLikeImage } from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';


const router = express.Router();


import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post('/generate-article', authenticate, generateArticle);
router.post('/generate-blog-title', authenticate, generateBlogTitle);
router.post('/generate-image', authenticate, generateImage);
router.post('/remove-background', authenticate ,upload.single('image'), removeImageBackground);
router.post('/resume-review', authenticate, upload.single('resume'), resumeReview);
router.get('/community/images' , authenticate , getPublicImages ) ;
router.post('/community/like/:id' , authenticate , toggleLikeImage ) ;
router.get("/user/creations", authenticate, getUserCreations);

export default router;
