import { useState } from "react";
import useStake from "../../hooks/useStake";
import { toast } from "sonner";

function StakeForm() {
  const { approve, stake, loading, approved } = useStake();
  const [amount, setAmount] = useState("");

  const handleApprove = async () => {
    if (!amount || Number(amount) <= 0) {
      toast("Enter a valid amount to approve.");
      return;
    }
    try {
      await approve(amount);
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleStake = async () => {
    if (!amount || Number(amount) <= 0) {
      toast("Enter a valid amount to stake.");
      return;
    }
    try {
      await stake(amount);
      setAmount("");
    } catch (err) {
      console.error("Stake failed:", err);
    }
  };

  return (
    <div className="bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] p-6 sm:p-8 text-center">
      <h1 className="text-[var(--text-color)] text-3xl sm:text-4xl font-bold mb-4">
        Stake Your Tokens
      </h1>
      <p className="text-gray-600 max-w-md mx-auto">
        Approve tokens first, then stake them to start earning rewards.
      </p>

      <div className="mt-8 max-w-sm mx-auto flex flex-col gap-4">
        {/* Input */}
        <input
          className="form-input w-full rounded-lg h-14 pl-4 pr-4 border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)]"
          placeholder="Enter amount"
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />

        {/* Approve button */}
        <button
          onClick={handleApprove}
          className={`btn-primary w-full rounded-lg h-14 px-6 text-base font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Approving..." : "Approve"}
        </button>

        {/* Stake button */}
        <button
          onClick={handleStake}
          className={`btn-primary w-full rounded-lg h-14 px-6 text-base font-semibold ${
            loading || !approved ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !approved}
        >
          {loading ? "Staking..." : "Stake"}
        </button>
      </div>
    </div>
  );
}

export default StakeForm;
