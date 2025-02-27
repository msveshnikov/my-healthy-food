import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from './middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

dotenv.config(true);

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const transporter = nodemailer.createTransport({
    service: 'icloud',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const userRoutes = (app) => {
    app.post(
        '/api/auth/signup',
        [
            body('firstName').trim().notEmpty().withMessage('First name is required'),
            body('lastName').trim().notEmpty().withMessage('Last name is required'),
            body('email')
                .trim()
                .notEmpty()
                .isEmail()
                .withMessage('Invalid email address')
                .normalizeEmail(),
            body('password')
                .if(body('credential').notExists())
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long')
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            try {
                const { credential, firstName, lastName, email, password } = req.body;
                let user;
                if (credential) {
                    const ticket = await googleClient.verifyIdToken({
                        idToken: credential,
                        audience: process.env.GOOGLE_CLIENT_ID
                    });
                    const { email: googleEmail, given_name, family_name } = ticket.getPayload();
                    user = await User.findOne({ email: googleEmail });
                    if (!user) {
                        user = new User({
                            email: googleEmail,
                            firstName: given_name,
                            lastName: family_name,
                            password: bcrypt.hashSync(Math.random().toString(36), 10),
                            emailVerified: true,
                            subscriptionStatus: 'free'
                        });
                        await user.save();
                    }
                } else {
                    const existingUser = await User.findOne({ email });
                    if (existingUser) {
                        return res.status(409).json({ error: 'Email is already taken' });
                    }
                    const hashedPassword = await bcrypt.hash(password, 10);
                    user = new User({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        subscriptionStatus: 'free',
                        verificationToken: crypto.randomBytes(32).toString('hex')
                    });
                    await user.save();
                    const verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${user.verificationToken}&email=${encodeURIComponent(email)}`;
                    await transporter.sendMail({
                        to: email,
                        from: process.env.FROM_EMAIL,
                        subject: 'Welcome to MyHealthy.Food! Verify Your Email',
                        html: `
                        <html>
                        <body style="font-family: 'Open Sans', sans-serif; color: #333;">
                            <div style="max-width:600px; margin: auto; padding:20px; border:1px solid #eee; border-radius:8px; background-color:#fff;">
                            <h1 style="color: #3498DB;">Welcome to MyHealthy.Food!</h1>
                            <p>Hi ${firstName},</p>
                            <p>Thank you for signing up for MyHealthy.Food – your platform for healthy AI recipes.</p>
                            <p>Please verify your email address to activate your account:</p>
                            <a href="${verificationLink}" style="display:inline-block; padding:10px 20px; margin:10px 0; background-color:#3498DB; color:#fff; text-decoration:none; border-radius:4px;">Verify Your Email</a>
                            <p>Once verified, you can start exploring healthy recipes.</p>
                            <p>If you have any questions, our support team is here to help.</p>
                            <p>Warm regards,<br>The MyHealthy.Food Team</p>
                            </div>
                        </body>
                        </html>
          `
                    });
                }
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                res.status(201).json({ token, user: { ...user.toJSON(), password: undefined } });
            } catch (error) {
                console.error('Signup error:', error);
                res.status(500).json({ error: 'Registration failed', details: error.message });
            }
        }
    );

    app.post(
        '/api/auth/login',
        [
            body('email')
                .trim()
                .notEmpty()
                .isEmail()
                .withMessage('Invalid email address')
                .normalizeEmail(),
            body('password').notEmpty().withMessage('Password is required')
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            try {
                const { email, password } = req.body;
                const user = await User.findOne({ email });
                if (!user) return res.status(404).json({ error: 'Invalid credentials' });

                if (!user.emailVerified) {
                    return res.status(403).json({ error: 'Email not verified' });
                }

                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                res.json({ token, user: { ...user.toJSON(), password: undefined } });
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ error: 'Login failed', details: error.message });
            }
        }
    );

    app.get('/api/profile', authenticateToken, async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            console.error('Profile fetch error:', error);
            res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
        }
    });

    app.put(
        '/api/profile',
        authenticateToken,
        [
            body('firstName')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('First name cannot be empty'),
            body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
            body('researchPreferences.field').optional().trim(),
            body('researchPreferences.dataSources').optional().trim(),
            body('researchPreferences.aiAssistance')
                .optional()
                .isIn(['minimal', 'moderate', 'full']),
            body('presentationSettings.slideLayout').optional().trim(),
            body('presentationSettings.theme').optional().trim()
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            try {
                const {
                    firstName,
                    lastName,
                    preferences,
                    presentationSettings,
                    researchPreferences
                } = req.body;
                const updateFields = {};
                if (firstName !== undefined) updateFields.firstName = firstName;
                if (lastName !== undefined) updateFields.lastName = lastName;
                if (preferences !== undefined) updateFields.preferences = preferences;
                if (presentationSettings !== undefined)
                    updateFields.presentationSettings = presentationSettings;
                if (researchPreferences !== undefined)
                    updateFields.researchPreferences = researchPreferences;

                const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
                    new: true,
                    runValidators: true
                }).select('-password');
                if (!user) return res.status(404).json({ error: 'User not found' });
                res.json(user);
            } catch (error) {
                console.error('Profile update error:', error);
                res.status(500).json({ error: 'Failed to update profile', details: error.message });
            }
        }
    );

    app.post(
        '/api/auth/reset-password',
        [
            body('email')
                .trim()
                .notEmpty()
                .isEmail()
                .withMessage('Invalid email address')
                .normalizeEmail()
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { email } = req.body;
                const user = await User.findOne({ email });
                if (!user) return res.status(404).json({ error: 'User not found' });

                if (!user.emailVerified) {
                    return res
                        .status(400)
                        .json({
                            error: 'Email address is not verified. Please verify your email first.'
                        });
                }

                const resetToken = user.generatePasswordResetToken();
                await user.save();
                const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

                await transporter.sendMail({
                    to: email,
                    from: process.env.FROM_EMAIL,
                    subject: 'Password Reset Request - MyHealthy.Food',
                    html: `
          <html>
            <body style="font-family: 'Open Sans', sans-serif; color: #333;">
              <div style="max-width:600px; margin: auto; padding:20px; border:1px solid #eee; border-radius:8px; background-color:#fff;">
                <h1 style="color: #3498DB;">Password Reset Request</h1>
                <p>Hello,</p>
                <p>You have requested to reset your password for your MyHealthy.Food account. Please click the button below to proceed:</p>
                <a href="${resetLink}" style="display:inline-block; padding:10px 20px; margin:10px 0; background-color:#3498DB; color:#fff; text-decoration:none; border-radius:4px;">Reset Your Password</a>
                <p>This link is valid for 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
              </div>
            </body>
          </html>
        `
                });
                res.json({ message: 'Password reset email sent' });
            } catch (error) {
                console.error('Password reset request error:', error);
                res.status(500).json({
                    error: 'Failed to send reset email',
                    details: error.message
                });
            }
        }
    );

    app.post(
        '/api/auth/reset-password/:token',
        [
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long')
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { password } = req.body;
                const tokenHash = crypto
                    .createHash('sha256')
                    .update(req.params.token)
                    .digest('hex');
                const user = await User.findOne({
                    resetPasswordToken: tokenHash,
                    resetPasswordExpires: { $gt: Date.now() }
                });
                if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });

                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();
                res.json({ message: 'Password reset successful' });
            } catch (error) {
                console.error('Password reset error:', error);
                res.status(500).json({ error: 'Password reset failed', details: error.message });
            }
        }
    );

    app.get('/api/auth/verify-email', async (req, res) => {
        try {
            const { token, email } = req.query;
            if (!token || !email) {
                return res.status(400).send(`
          <html>
            <body style="font-family: 'Open Sans', sans-serif; color: #333;">
              <div style="max-width:600px; margin: auto; padding:20px;">
                <h1 style="color:#E74C3C;">Verification Failed</h1>
                <p>Invalid verification parameters.</p>
              </div>
            </body>
          </html>
        `);
            }
            const user = await User.findOne({ email, verificationToken: token });
            if (!user) {
                return res.status(400).send(`
          <html>
            <body style="font-family: 'Open Sans', sans-serif; color: #333;">
              <div style="max-width:600px; margin: auto; padding:20px;">
                <h1 style="color:#E74C3C;">Verification Failed</h1>
                <p>Invalid or expired verification token.</p>
              </div>
            </body>
          </html>
        `);
            }
            user.emailVerified = true;
            user.verificationToken = undefined;
            await user.save();
            res.send(`
        <html>
          <body style="font-family: 'Open Sans', sans-serif; background-color:#f4f4f4; color:#333;">
            <div style="max-width:600px; margin: auto; padding:20px; background-color:#fff; border-radius:8px; text-align:center;">
              <h1 style="color:#3498DB;">Welcome to MyHealthy.Food!</h1>
              <p>Your email has been successfully verified.</p>
              <p>Explore our platform to discover healthy recipes.</p>
              <a href="${process.env.FRONTEND_URL}" style="display:inline-block; padding:10px 20px; background-color:#3498DB; color:#fff; text-decoration:none; border-radius:4px;">Go to MyHealthy.Food</a>
            </div>
          </body>
        </html>
      `);
        } catch (error) {
            console.error('Email verification error:', error);
            res.status(500).send(`
        <html>
          <body style="font-family: 'Open Sans', sans-serif; color:#333;">
            <div style="max-width:600px; margin: auto; padding:20px;">
              <h1 style="color:#E74C3C;">Verification Error</h1>
              <p>Email verification failed.</p>
            </div>
          </body>
        </html>
      `);
        }
    });
};

export default userRoutes;
