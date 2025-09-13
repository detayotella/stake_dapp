// hooks/useStake.js
import { useState, useCallback, useContext } from "react";
import {
  useAccount,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { STAKE_CONTRACT_ABI, STAKE_TOKEN_ABI } from "../config/ABI";
import { parseEther } from "viem";
import { toast } from "sonner";
import { GlobalStateContext } from "../context";

const useStake = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const { loading, setLoading } = useContext(GlobalStateContext);

  const [approved, setApproved] = useState(false);

  // 1️⃣ Approve only
  const approve = useCallback(
    async (amount) => {
      if (!address) {
        toast("Please connect your wallet");
        return;
      }

      try {
        setLoading(true);
        const bigAmount = parseEther(amount.toString());

        // simulate approve tx
        const approveSim = await publicClient.simulateContract({
          address: import.meta.env.VITE_STAKING_TOKEN,
          abi: STAKE_TOKEN_ABI,
          functionName: "approve",
          args: [import.meta.env.VITE_STAKING_CONTRACT, bigAmount],
          account: address,
        });

        // send tx
        const tx = await writeContractAsync(approveSim.request);

        toast("Approval submitted, waiting for confirmation...");
        setApproved(true); // ✅ allow staking only after approval
        return tx;
      } catch (err) {
        console.error("Approval error:", err);
        toast.error("Approval failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [address, writeContractAsync, publicClient, setLoading]
  );

  // 2️⃣ Stake only
  const stake = useCallback(
    async (amount) => {
      if (!address) {
        toast("Please connect your wallet");
        return;
      }

      if (!approved) {
        toast("You must approve tokens first!");
        return;
      }

      try {
        setLoading(true);
        const bigAmount = parseEther(amount.toString());

        // simulate stake tx
        const stakeSim = await publicClient.simulateContract({
          address: import.meta.env.VITE_STAKING_CONTRACT,
          abi: STAKE_CONTRACT_ABI,
          functionName: "stake",
          args: [bigAmount],
          account: address,
        });

        // send tx
        const tx = await writeContractAsync(stakeSim.request);

        toast("Stake submitted!");
        return tx;
      } catch (err) {
        console.error("Staking error:", err);
        toast.error("Stake failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [address, approved, writeContractAsync, publicClient, setLoading]
  );

  return { approve, stake, loading, approved };
};

export default useStake;
