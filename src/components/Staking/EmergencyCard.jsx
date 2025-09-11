function EmergencyCard() {
  return (
    <div className="bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] p-6 text-center">
      <h3 className=" text-lg font-semibold text-[var(--text-color)] mb-4">Emergency</h3>
      <button className="mt-16 btn-secondary border-red-500 text-red-500 hover:bg-red-50 w-full h-12 rounded-lg font-semibold text-base">
        Emergency Withdraw
      </button>
    </div>
  );
}

export default EmergencyCard;