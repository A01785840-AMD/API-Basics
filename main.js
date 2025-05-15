import dotenv from 'dotenv';
import express from 'express';
import router from './src/router.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(router);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
