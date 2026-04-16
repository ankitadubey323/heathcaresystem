import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import cloudinary from '../config/cloudinary.js'

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (err, result) => err ? reject(err) : resolve(result)
        ).end(buffer)
    })
}

export const register = async (req, res) => {
    try {
        const { name, email, password, phone, city, state, age, weight, height } = req.body

        const existing = await User.findOne({ email })
        if (existing) return res.status(400).json({ message: 'Email already registered' })

        let profilePhoto = ''
        let aadhaarUrl = ''

        if (req.files?.profilePhoto) {
            const result = await uploadToCloudinary(
                req.files.profilePhoto[0].buffer,
                'health-ai/profiles'
            )
            profilePhoto = result.secure_url
        }

        if (req.files?.aadhaar) {
            const result = await uploadToCloudinary(
                req.files.aadhaar[0].buffer,
                'health-ai/aadhaar'
            )
            aadhaarUrl = result.secure_url
        }

        const user = await User.create({
            name, email, password,
            phone, city, state,
            age: age ? Number(age) : undefined,
            weight: weight ? Number(weight) : undefined,
            height: height ? Number(height) : undefined,
            profilePhoto,
            aadhaarUrl,
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({
            message: 'Registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                state: user.state,
                age: user.age,
                weight: user.weight,
                height: user.height,
                bmi: user.bmi,
                profilePhoto: user.profilePhoto,
            }
        })
    } catch (err) {
        console.error('REGISTER ERROR:', err)
        res.status(500).json({ message: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required' })

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const isMatch = await user.comparePassword(password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                state: user.state,
                age: user.age,
                bmi: user.bmi,
                profilePhoto: user.profilePhoto,
            }
        })
    } catch (err) {
        console.error('LOGIN ERROR:', err) // full error object
        res.status(500).json({ message: err.message })
    }
}