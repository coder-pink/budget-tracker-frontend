const SummaryCard = ({ label, value, color }) => {
    return (
      <div className={`p-4 rounded-xl shadow bg-${color}-100 text-${color}-900`}>
        <h3 className="text-sm font-semibold mb-1">{label}</h3>
        <p className="text-2xl font-bold">${value}</p>
      </div>
    );
  };
  
  export default SummaryCard;
  