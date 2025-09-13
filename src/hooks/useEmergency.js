import { useState, useCallback, useContext } from "react";
import {
  useAccount,
  useWriteContract,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";
import { STAKE_CONTRACT_ABI } from "../config/ABI";
import { toast } from "sonner";
import { GlobalStateContext } from "../context";

const useEmergency = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // const [loading, setLoading] = useState(false);
  const { loading, setLoading} = useContext(GlobalStateContext);
  const [lastEmergencyAmount, setLastEmergencyAmount] = useState("0");
  const [lastEmergencyTime, setLastEmergencyTime] = useState(null);

  const emergencyWithdraw = useCallback(async () => {
    if (!address) {
      toast("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);

      const { request } = await publicClient.simulateContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKE_CONTRACT_ABI,
        functionName: "emergencyWithdraw",
        account: address,
      });

      const txHash = await writeContractAsync(request);
      console.log("Emergency withdraw tx:", txHash);
      toast("Emergency withdraw submitted");
    } catch (err) {
      console.error("Emergency withdraw error:", err);
      toast.error("Emergency withdraw failed");
    } finally {
      setLoading(false);
    }
  }, [address, publicClient, writeContractAsync]);


  useWatchContractEvent({
    address: import.meta.env.VITE_STAKING_CONTRACT,
    abi: STAKE_CONTRACT_ABI,
    eventName: "EmergencyWithdraw",
    onLogs(logs) {
      logs.forEach((log) => {
        const { user, amount, timestamp } = log.args;
        if (user?.toLowerCase() === address?.toLowerCase()) {
          console.log("EmergencyWithdraw event:", log.args);
          setLastEmergencyAmount(amount?.toString() || "0");
          setLastEmergencyTime(timestamp?.toString() || null);
          toast.success(`You emergency withdrew ${amount?.toString()} tokens`);
        }
      });
    },
  });

  return { emergencyWithdraw, loading, lastEmergencyAmount, lastEmergencyTime };
};

export default useEmergency;
