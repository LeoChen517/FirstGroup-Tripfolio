import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();
app.use(express.json());

app.use('/api', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
