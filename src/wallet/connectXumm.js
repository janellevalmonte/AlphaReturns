import { Xumm } from "xumm";

let started = false; // guard against double execution

export async function connectWallet() {
  if (started) return;
  started = true;

  console.log("connectWallet started");

  try {
    const xumm = new Xumm("bda57f01-848e-4edf-aebb-7cb63f59dabe");

    const payload = await xumm.payload.create({
      TransactionType: "SignIn",
    });

    console.log("Redirecting to:", payload.next.always);

    // ✅ FULL PAGE REDIRECT (reliable)
    window.location.href = payload.next.always;

  } catch (err) {
    started = false;
    console.error("Xumm error:", err);
  }
}
