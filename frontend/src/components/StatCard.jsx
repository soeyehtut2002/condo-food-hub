export default function StatCard({ icon, label, value, color = 'var(--primary)', bgColor = 'var(--primary-light)' }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color, '--stat-bg': bgColor }}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-info">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>

      <style>{`
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
        }
        .stat-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .stat-card-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--stat-bg);
          color: var(--stat-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-card-info {
          display: flex;
          flex-direction: column;
        }
        .stat-card-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .stat-card-label {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
