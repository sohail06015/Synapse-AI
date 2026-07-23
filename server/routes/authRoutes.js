import express from 'express' ;
import { changePassword, forgotPassword, getUserProfile, login, resetPassword, signup, verifyOTP } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router() ;


router.post('/signup', signup);
router.post('/verify', verifyOTP);  
router.post('/login', login);  

router.get('/profile', authenticate, getUserProfile);

router.post('/forgot-password', forgotPassword);    
router.post('/reset-password', resetPassword);      
router.post('/change-password', authenticate, changePassword); 

export default router ;