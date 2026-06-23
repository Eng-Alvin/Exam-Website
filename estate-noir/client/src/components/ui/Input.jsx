const Input = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-xs font-medium tracking-wide text-ink-soft">
        {label}
      </label>
    )}
    <input
      className={`w-full bg-white border ${error ? 'border-red-400' : 'border-line'} text-ink placeholder-ink-faint px-4 py-3 text-sm rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all duration-200 ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default Input;
