import express from 'express'
import upload from '../middleware/upload.js'
import { register, login } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'aadhaar', maxCount: 1 }
]), (req, res) => register(req, res))

router.post('/login', login)

export default router