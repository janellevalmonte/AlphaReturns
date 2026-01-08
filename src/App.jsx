import { useState } from "react";
import { Xumm } from "xumm";

export default function App() {
  const [qr, setQr] = useState(null);

  async function connectWallet() {
    console.log("connectWallet called");

    const xumm = new Xumm("NEW_API_KEY_HERE"); // ← use the NEW app key

    const payload = await xumm.payload.create({
      txjson: {
        TransactionType: "SignIn",
      },
    });

    console.log("FULL PAYLOAD:", payload);
    console.log("SIGNIN LINK:", payload.next.always);

    // THIS is the real link
    setQr(payload.next.always);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Wallet Demo</h1>

      <button onClick={connectWallet}>
        Connect Wallet
      </button>

      {qr && (
        <p>
          Sign in via Xumm:{" "}
          <a href={qr} target="_blank" rel="noreferrer">
            {qr}
          </a>
        </p>
      )}
    </div>
  );
}
