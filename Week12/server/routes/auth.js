import express from 'express';
import { findParticipantByEmail } from '../repositories/participants.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findParticipantByEmail(email);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // simplistic login response, usually a token
        res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        next(error);
    }
});

export default router;
