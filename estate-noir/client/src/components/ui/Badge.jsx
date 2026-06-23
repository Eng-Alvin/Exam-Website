const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-gold/10 text-gold border border-gold/20 ${className}`}>
    {children}
  </span>
);

export default Badge;
