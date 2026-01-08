import React, { useState } from "react";
import { XummSdk } from "xumm-sdk";

// Configuration
const RLUSD_ISSUER = "rHfoQSAeuESoVGiQ5FEHi7CZDewF6u67cj";
const TESTNET_SERVER = "wss://s.altnet.rippletest.net:51233";

export default function App() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const sendRLUSD = async () => {
    setStatus("Creating payload...");

    try {
      const response = await fetch("http://localhost:3001/create-payload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txjson: {
            TransactionType: "Payment",
            Destination: recipient,
            Amount: {
              currency: "RLUSD",
              value: amount,
              issuer: RLUSD_ISSUER
            }
          },
          options: { submit: true }
        })
      });

      const payload = await response.json();
      console.log(payload)
      window.open(payload.next.always, "_blank");
      setStatus("Payload created! Waiting for user approval...");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Send RLUSD (Testnet)</h1>

      <input
        placeholder="Recipient XRPL address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        style={{ width: "300px", marginRight: 10 }}
      />
      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100px" }}
      />
      <button onClick={sendRLUSD} style={{ marginLeft: 10 }}>
        Send RLUSD
      </button>

      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
}



// issuer account
// address = rHfoQSAeuESoVGiQ5FEHi7CZDewF6u67cj
// secret = sEd7JTsXY8jQHnyMEUo8eCiedcXLkrp
// balance = 100 xrp
// seq number = 13854821

// user account
// address = rPxH6RYHzFq6VrMgkRbooYSur4fRSvfEXx
// secret = sEdVWTzSCunwbjyBeJiRhPci9nKdJKS
// balance = 100 xrp
// seq number = 13854851