import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 1. Create __dirname manually (since it's not available in ES Modules by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Specify the path to the .env file located one level up
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debugging: This will now show you if the keys are actually loaded
console.log("XUMM_API_KEY exists:", !!process.env.XUMM_API_KEY);

app.post("/create-payload", async (req, res) => {
    try {
        const payload = await xumm.payload.create(req.body);
        res.json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});
