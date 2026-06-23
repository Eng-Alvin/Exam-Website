const EmptyState = ({ title = 'No results found', message = '', action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
    <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center text-2xl text-gold/60">◈</div>
    <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
    {message && <p className="text-sm text-ink-soft max-w-xs">{message}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
