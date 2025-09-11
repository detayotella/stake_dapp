import { useState, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  usePublicClient,
  useWatchContractEvent,
  useWalletClient,
} from "wagmi";
import { STAKE_CONTRACT_ABI } from "../config/ABI";
import { toast } from "sonner";

const useClaim = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  
  const [loading, setLoading] = useState(false);
  const [latestClaimed, setLatestClaimed] = useState("0"); 
  const [pendingRewards, setPendingRewards] = useState("0");

  const claimRewards = useCallback(async () => {
    if (!address || !walletClient) {
      toast("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);

      const { request } = await publicClient.simulateContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKE_CONTRACT_ABI,
        functionName: "claimRewards",
        account: address,
      });

      const txHash = await writeContractAsync(request);
    //   console.log("Claim tx hash:", txHash);
    } catch (err) {
      console.error("Claim error:", err);
    } finally {
      setLoading(false);
    }
  }, [address, publicClient, writeContractAsync]);

  useWatchContractEvent({
    address: import.meta.env.VITE_STAKING_CONTRACT,
    abi: STAKE_CONTRACT_ABI,
    eventName: "RewardsClaimed",
    onLogs(logs) {
      logs.forEach((log) => {
        const { amount, newPendingRewards } = log.args;
        console.log("Reward claimed:", amount?.toString());
        setLatestClaimed(amount?.toString());
        setPendingRewards(newPendingRewards?.toString());
      });
    },
  });

  return {
    claimRewards,
    loading,
    latestClaimed,
    pendingRewards,
  };
};

export default useClaim;
