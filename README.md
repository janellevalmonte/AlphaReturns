# AlphaReturns 🚀

AlphaReturns is a web-based XRPL (XRP Ledger) application that enables users to send **XRP** on the **XRPL Testnet** using **Xaman (formerly Xumm)** for secure transaction signing.


<img width="561" height="807" alt="image" src="https://github.com/user-attachments/assets/fa2b2364-dfe2-4d87-9db1-1151a5002c71" />

---

## 📌 Features

- XRPL Testnet integration
- Secure transaction signing via Xaman
- QR-based wallet authorization
- Vite-powered frontend
- Node.js backend with Xumm SDK

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js (Express-style server)
- **Blockchain:** XRPL Testnet
- **Wallet:** Xaman (Xumm)
- **Auth / Signing:** Xumm SDK

---

## 🚀 Getting Started

Follow the steps below to set up and run the project locally.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (included with Node.js)
- **Xaman Wallet App** on your mobile device  
  - Set wallet to **Testnet mode**

---

## Installation

Clone the repository and install dependencies from the root directory:

```
git clone <your-repo-url>
cd AlphaReturns
npm install
npm run dev 
```
## Backend Setup 

1. Navigate to the backend directory

```
cd AlphaReturns/backend
```
2. Add Xaman credentials using [Xaman Developer Console] (https://apps.xaman.dev/)
in a .env file

```
XUMM_API_KEY=your_api_key_here
XUMM_API_SECRET=your_api_secret_here
```
3. Run the backend service

```
node backend/server.js

```
## Running the application 
You must run **both** the backend and frontend servers.

Expected output from backend 
```
Environment check:
XUMM_API_KEY exists: true
XUMM_API_SECRET exists: true
Xumm SDK initialized successfully!
```

Expected output from frontend and click on
```
http://localhost:5173

```

## Try It Out! (Test Drive)
To use the application, you need Testnet Accounts. You can generate them using the [XRPL Faucets](https://xrpl.org/resources/dev-tools/xrp-faucets)
1. Sender Account (to send XRP)
2. Receiver Account (to receive XRP)

There is a test receiver address attached, by all means you can create your own one and see the funds transfer !


