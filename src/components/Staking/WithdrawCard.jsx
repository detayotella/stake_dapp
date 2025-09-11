import { useState } from "react";
import useWithdraw from "../../hooks/useWithdraw";
import { toast } from "sonner";

function WithdrawCard() {
  const { withdraw, loading } = useWithdraw();
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      console.log("Enter a valid amount");
      return;
    }

    try {
      const txHash = await withdraw(amount);
      toast("Staked successfully!", {
            description: `Transaction Hash: ${txHash}`,
            action: {
            label: "View",
            onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank")}
    })
    } catch (err) {
      toast.error(`Stake flow failed: ${err}`); 
    }
  };

  return (
    <div className="bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] p-6 text-center">
      <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
        Withdraw Stake
      </h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="form-input w-full rounded-lg h-12 px-4 border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] mb-4"
      />

      <button
        onClick={handleWithdraw}
        disabled={loading}
        className={`btn-secondary w-full h-12 rounded-lg font-semibold text-base transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Withdrawing..." : "Withdraw"}
      </button>
    </div>
  );
}

export default WithdrawCard;
