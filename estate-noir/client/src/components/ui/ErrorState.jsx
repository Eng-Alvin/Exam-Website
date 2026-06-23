const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-2xl text-red-500">⚠</div>
    <h3 className="font-display text-xl font-semibold text-ink">Connection Lost</h3>
    <p className="text-sm text-ink-soft max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 text-sm font-medium text-gold border border-gold/50 rounded-xl px-5 py-2.5 hover:bg-gold/10 transition-colors cursor-pointer"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
