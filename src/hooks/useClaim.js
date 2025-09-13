import { useState, useEffect, useContext } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { GlobalStateContext } from "../context";
import { useSubgraph } from "./useSubgraph";

const useClaim = () => {
  const { address } = useAccount();
  const { loading, setLoading } = useContext(GlobalStateContext);
  const { getUserRewards } = useSubgraph();
  const [latestClaimed, setLatestClaimed] = useState("0");
  const [pendingRewards, setPendingRewards] = useState("0");

  // just the claim transaction (onchain write)
  const claimRewards = async () => {
    if (!address) {
      toast("Please connect your wallet");
      return;
    }
    try {
      setLoading(true);
    
    } catch (err) {
      console.error("Claim error:", err);
    } finally {
      setLoading(false);
    }
  };

  // poll subgraph instead of watch event
  useEffect(() => {
    const fetchRewards = async () => {
      if (!address) return;
      const data = await getUserRewards(address);
      if (data.rewardsClaimeds.length > 0) {
        const latest = data.rewardsClaimeds[0];
        setLatestClaimed(latest.amount);
        setPendingRewards(latest.newPendingRewards);
      }
    };

    fetchRewards();
    const interval = setInterval(fetchRewards, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [address]);

  return { claimRewards, loading, latestClaimed, pendingRewards };
};

export default useClaim;
