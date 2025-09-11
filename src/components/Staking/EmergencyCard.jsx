import useEmergency from "../../hooks/useEmergency";

function EmergencyCard() {
  const { emergencyWithdraw } = useEmergency(); 

  const handleEmergencyWithdraw = async () => {
    try {
      const txHash = await emergencyWithdraw();
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
      <h3 className=" text-lg font-semibold text-[var(--text-color)] mb-4">Emergency</h3>
      <button onClick={handleEmergencyWithdraw} className="mt-16 btn-secondary border-red-500 text-red-500 hover:bg-red-50 w-full h-12 rounded-lg font-semibold text-base">
        Emergency Withdraw
      </button>
    </div>
  );
}

export default EmergencyCard;