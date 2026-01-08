import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { XummSdk } from 'xumm-sdk';
import { Client } from 'xrpl'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Log environment variables
console.log('Environment check:');
console.log('XUMM_API_KEY exists:', !!process.env.XUMM_API_KEY);
console.log('XUMM_API_SECRET exists:', !!process.env.XUMM_API_SECRET);

// Initialize Xumm SDK 
const xumm = new XummSdk(
    process.env.XUMM_API_KEY,
    process.env.XUMM_API_SECRET
);

console.log('Xumm SDK initialized successfully!');

// Test the connection on startup
(async () => {
    try {
        console.log('\nTesting Xumm API connection...');
        const ping = await xumm.ping();
        console.log('✅ Xumm API connected successfully!');
        console.log('Ping response:', ping);
    } catch (error) {
        console.error('❌ Xumm API connection failed!');
        console.error('Error:', error.message);
        console.error('This might mean your API keys are invalid.');
    }
})();

// Store payment requests
const paymentRequests = new Map();

// Create payment request
app.post("/create-payment", async (req, res) => {
    try {
        console.log('\n=== New XRP Payment Request ===');
        const { destination, amount } = req.body;

        if (!destination || !amount) {
            return res.status(400).json({
                error: "Missing destination or amount"
            });
        }

        console.log(`Creating: ${amount} XRP to ${destination}`);

        const payloadData = {
            txjson: {
                TransactionType: "Payment",
                Destination: destination,
                Amount: String(Math.floor(parseFloat(amount) * 1000000)) // Convert to drops
            },
            options: {
                submit: true
            }
        };

        console.log('Payload data:', JSON.stringify(payloadData, null, 2));

        const payload = await xumm.payload.create(payloadData);

        console.log('Payload response:', payload);

        if (!payload || !payload.uuid) {
            throw new Error('Xumm returned invalid response: ' + JSON.stringify(payload));
        }

        console.log('Payload created:', payload.uuid);

        paymentRequests.set(payload.uuid, {
            destination,
            amount,
            created: Date.now(),
            signed: false,
            rejected: false,
            txHash: null
        });

        res.json({
            uuid: payload.uuid,
            qrUrl: payload.next.always,
            qrImage: payload.refs.qr_png
        });

        if (payload.websocket) {
            payload.websocket.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    console.log('WebSocket message:', data);

                    const stored = paymentRequests.get(payload.uuid);
                    if (stored && data.signed !== undefined) {
                        stored.signed = data.signed;
                        stored.rejected = !data.signed;
                        if (data.txid) {
                            stored.txHash = data.txid;
                            console.log('Transaction:', data.txid);
                        }
                    }
                } catch (err) {
                    console.error('WebSocket parse error:', err);
                }
            };
        }

    } catch (error) {
        console.error("=== Error creating XRP payment ===");
        console.error("Error:", error);

        res.status(500).json({
            error: error.message || "Failed to create payment"
        });
    }
});

// Check payment status
app.get("/payment-status/:uuid", async (req, res) => {
    try {
        const { uuid } = req.params;
        const stored = paymentRequests.get(uuid);

        if (!stored) {
            return res.status(404).json({ error: "Payment not found" });
        }

        // Try to get latest from Xumm
        try {
            const payload = await xumm.payload.get(uuid);
            if (payload.response?.txid) {
                stored.txHash = payload.response.txid;
                stored.signed = true;
            }
            if (payload.response?.signed !== undefined) {
                stored.signed = payload.response.signed;
                stored.rejected = !payload.response.signed;
            }
        } catch (err) {
            console.error('Error fetching status:', err.message);
        }

        res.json({
            signed: stored.signed,
            rejected: stored.rejected,
            txHash: stored.txHash,
            amount: stored.amount,
            destination: stored.destination
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to check status" });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        xummConfigured: !!(process.env.XUMM_API_KEY && process.env.XUMM_API_SECRET)
    });
});

app.post("/verify-address", async (req, res) => {
    const { address } = req.body;
    console.log(`Verifying address: ${address}`)
    try {
        let client;
        client = new Client('wss://testnet.xrpl-labs.com');
        await client.connect();
        console.log('Connected to XRPL');

        const response = await client.request({
            command: 'account_info',
            account: address,
            ledger_index: 'validated'
        });


        console.log(response)

        await client.disconnect();

        res.json({
            exists: true,
            validated: response.result.validated,
            requiresTag: (response.result.account_data.Flags & 0x00100000) !== 0, // RequireDestTag flag
            balance: response.result.account_data.Balance
        });
    } catch (err) {
        res.json({ exists: false });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}\n`);
});