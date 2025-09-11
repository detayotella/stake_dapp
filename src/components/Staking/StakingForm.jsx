import { useState } from "react";
import useStake from "../../hooks/useStake";
import { toast } from "sonner";

function StakeForm() {
  const { approveAndStake, loading } = useStake();
  const [amount, setAmount] = useState(""); 

  const handleStake = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      alert("Enter a valid amount to stake.");
      return;
    }

    try {
      const txHash = await approveAndStake(numericAmount);
      toast("Staked successfully!", {
            description: `Transaction Hash: ${txHash}`,
            action: {
            label: "View",
            onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank")}
    })
      setAmount(""); 
    } catch (err) {
      console.error("Staking failed:", err);
      toast.error(`Stake flow failed: ${err}`)
    }
  };

  return (
    <div className="bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] p-6 sm:p-8 text-center">
      <h1 className="text-[var(--text-color)] text-3xl sm:text-4xl font-bold mb-4">
        Stake Your Tokens
      </h1>
      <p className="text-gray-600 max-w-md mx-auto">
        Easily stake your assets and start earning rewards. Enter the amount you want to stake below.
      </p>

      <div className="mt-8 max-w-sm mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <input
            className="form-input w-full rounded-lg h-14 pl-10 pr-4 border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)]"
            placeholder="Enter amount"
            type="number"
            min="0"
            step="any" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}g
          />
        </div>

        <button
          onClick={handleStake}
          className={`btn-primary flex w-full sm:w-auto min-w-[120px] justify-center rounded-lg h-14 px-6 text-base font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Staking..." : "Stake"}
        </button>
      </div>
    </div>
  );
}

export default StakeForm;
