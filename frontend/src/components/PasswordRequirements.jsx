export default function PasswordRequirements({ password }) {
  if (!password) return null

  const checks = [
    { label: '8 caractères minimum', valid: password.length >= 8 },
    { label: '1 lettre majuscule', valid: /[A-Z]/.test(password) },
    { label: '1 lettre minuscule', valid: /[a-z]/.test(password) },
    { label: '1 chiffre', valid: /[0-9]/.test(password) }
  ]

  return (
    <div style={{
      marginTop: 8,
      marginBottom: 12,
      padding: '8px 12px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      fontSize: 12,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 6
    }}>
      {checks.map((c, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: c.valid ? '#22C55E' : 'var(--text-secondary)',
            fontWeight: c.valid ? 500 : 400,
            transition: 'color 0.2s ease'
          }}
        >
          <span>{c.valid ? '✓' : '○'}</span>
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  )
}
