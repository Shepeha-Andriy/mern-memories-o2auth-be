import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signin = async (req, res) => { 
    try {
      const { email, password } = req.body
      
      const existingUser = await User.findOne({ email })
      if (!existingUser) {
        return res.status(400).json({message: 'User does not exist'})
      }

      const matchPassword = await bcrypt.compare(password, existingUser.password)
      if (!matchPassword) {
        return res.status(400).json({message: 'wrong email or password'})
      }

      const token = jwt.sign({
        email,
        id: existingUser._id
      },'test', { expiresIn: '1h'})
      
      res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const signup = async (req, res) => { 
    try {
      const { email, password, confirmPassword, firstName, lastName } = req.body
      
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({message: 'User is already exist'})
      }

      if (password !== confirmPassword) {
        return res.status(400).json({message: 'Passwords don\'t match'})
      }

      const salt = await bcrypt.genSalt(5)
      const hashPassword = await bcrypt.hash(password, salt)

      const user = await User.create({ email, password: hashPassword, name: `${firstName} ${lastName}`, })
      
      const token = jwt.sign({
        email,
        id: user._id
      },'test', { expiresIn: '1h'})
                
      res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}