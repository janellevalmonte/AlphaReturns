import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { AddressVerification } from './components/AddressVerification';
import { TransactionStatus } from './components/TransactionStatus';


export default function App() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipientAcc, setRecipientAcc] = useState(null)
  const [verifying, setVerifying] = useState(false)

  // verify recipient address when it changes 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (recipient && recipient.match(/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/)) {
        verifyAddress();
      } else {
        setRecipientAcc(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [recipient])

  const verifyAddress = async () => {
    setVerifying(true)
    try {
      const response = await fetch("http://localhost:3001/verify-address", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: recipient })
      })
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setRecipientAcc(data)
      } else {
        setRecipientAcc({ exists: false });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setRecipientAcc({ exists: false });
    }
    setVerifying(false);
  }

  const sendXRP = async () => {
    // Validation
    if (!recipient || !amount) {
      setStatus("❌ Please fill in all fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setStatus("❌ Amount must be greater than 0");
      return;
    }

    // Validate XRPL address format 
    if (!recipient.match(/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/)) {
      setStatus("❌ Invalid XRPL address format");
      return;
    }

    setLoading(true);
    setStatus("⏳ Creating payment request...");
    setTxHash("");

    try {
      // Call backend to send payment
      const response = await fetch("http://localhost:3001/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: recipient,
          amount: amount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment request failed");
      }

      // Open Xumm payment request in new window
      if (data.qrUrl) {
        const popup = window.open(data.qrUrl, "_blank");

        if (!popup || popup.closed || typeof popup.closed == 'undefined') {
          // Popup was blocked
          setStatus(`✅ Payment request created! Click here to sign: ${data.qrUrl}`);
        } else {
          setStatus("✅ Payment request created! Check the popup to sign.");
        }

        // Start polling for payment result
        pollPaymentStatus(data.uuid);
      }

    } catch (err) {
      console.error("Error:", err);
      setStatus(`❌ Error: ${err.message}`);
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (uuid) => {
    const maxAttempts = 60; // Poll for 2 minutes max
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3001/payment-status/${uuid}`);
        const data = await response.json();

        if (data.signed) {
          if (data.txHash) {
            setTxHash(data.txHash);
            setStatus("🎉 Payment successful!");
          } else {
            setStatus("✅ Payment signed but transaction pending...");
          }
          setLoading(false);
          return;
        }

        if (data.rejected) {
          setStatus("❌ Payment was rejected");
          setLoading(false);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000); // Check every 2 seconds
        } else {
          setStatus("⏱️ Payment request expired");
          setLoading(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setStatus("❌ Error checking payment status");
        setLoading(false);
      }
    };

    checkStatus();
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px'
      }}>
        💸 Send XRP (Testnet)
      </h1>

      <div style={{
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '13px'
      }}>
        <strong>🧪 Test Mode:</strong> You're using fake testnet XRP. No real money!
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500',
          color: '#555'
        }}>
          Recipient Address:
        </label>
        <input
          type="text"
          placeholder="rPxH6RYHzFq6VrMgkRbooYSur4fRSvfEXx"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontFamily: 'monospace',
            boxSizing: 'border-box'
          }}
        />
        <AddressVerification
          verifying={verifying}
          recipientAcc={recipientAcc}
          recipient={recipient}
        />
      </div>


      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500',
          color: '#555'
        }}>
          Amount (XRP):
        </label>
        <input
          type="number"
          placeholder="10.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          step="0.01"
          min="0"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button
        onClick={sendXRP}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          backgroundColor: loading ? '#ccc' : '#007bff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          if (!loading) e.target.style.backgroundColor = '#0056b3';
        }}
        onMouseOut={(e) => {
          if (!loading) e.target.style.backgroundColor = '#007bff';
        }}
      >
        {loading ? "Processing..." : "Send Payment"}
      </button>

      <TransactionStatus status={status} txHash={txHash} />

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <p><strong>📝 How to use:</strong></p>
        <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>
          <li>Enter recipient's XRPL address</li>
          <li>Enter amount of XRP to send</li>
          <li>Click "Send Payment"</li>
          <li>Sign the transaction in Xumm app</li>
        </ol>
        <p style={{ marginTop: '15px' }}>
          <strong>🧪 Test Address:</strong><br />
          <code style={{
            backgroundColor: '#f5f5f5',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px'
          }}>
            rPxH6RYHzFq6VrMgkRbooYSur4fRSvfEXx
          </code>
        </p>
      </div>
    </div>
  );
}