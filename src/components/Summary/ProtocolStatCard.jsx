
function ProtocolStatCard({ label, value }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg p-6 border border-[var(--border-color)] bg-[var(--card-background)]">
      <p className="text-gray-600 text-base font-medium">{label}</p>
      <p className="text-[var(--text-color)] text-3xl font-bold">{value}</p>
    </div>
  );
}


export default ProtocolStatCard;