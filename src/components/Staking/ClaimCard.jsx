import { toast } from "sonner";
import useClaim from "../../hooks/useClaim";

function ClaimCard() {
  const { claimRewards, loading, claimedAmount, latestClaimed } = useClaim();

  const handleClaimRewards = async () => {
    try {
      const txHash = await claimRewards();
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
        Claim Rewards
      </h3>

      <div className="mt-2">

        <p className="text-3xl font-bold">{latestClaimed} STK</p>
      </div>

      <button
        onClick={handleClaimRewards}
        disabled={loading}
        className={`mt-11 btn-secondary w-full h-12 rounded-lg font-semibold text-base ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Claiming..." : "Claim Rewards"}
      </button>
    </div>
  );
}

export default ClaimCard;
