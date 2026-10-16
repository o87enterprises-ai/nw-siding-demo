// Styled native <select>: accessible, and uses the phone's own picker on mobile.
export default function Dropdown({ label, value, onChange, options, className = '' }) {
  return (
    <label className={`dd ${className}`}>
      <span className="sr">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
      </select>
      <svg className="dd-caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </label>
  )
}
