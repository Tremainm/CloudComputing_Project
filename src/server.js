require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

const indexRoutes = require('./routes/indexRoutes');
const pantryRoutes = require('./routes/pantryRoutes');
const basketRoutes = require('./routes/basketRoutes');
const authRoutes = require('./routes/authRoutes');
const suggestionsRoutes = require('./routes/suggestionsRoutes');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 10mb to allow any image payloads if needed later

connectDB();

app.use('/', indexRoutes);  // GET /api/status
app.use('/auth', authRoutes); 
app.use('/pantry', protect, pantryRoutes); // GET|POST /pantry, GET|PUT|DELETE /pantry/:id
app.use('/basket', protect,  basketRoutes); // GET|POST /basket, PUT|DELETE /basket/:id
app.use('/suggestions', protect, suggestionsRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Pantry Manager server running on port: ${PORT}`);
});