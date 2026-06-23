const variants = {
  primary: 'bg-gold text-white hover:bg-gold-light font-semibold shadow-sm',
  outline: 'border border-gold/60 text-gold hover:bg-gold/10 hover:border-gold font-medium',
  ghost: 'text-ink-soft hover:text-ink hover:bg-black/[0.04] font-medium',
  danger: 'bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm',
};

const Button = ({ variant = 'primary', className = '', children, loading, ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && (
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
    )}
    {children}
  </button>
);

export default Button;
