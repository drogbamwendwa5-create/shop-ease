export default function Loading({ text = "Loading..." }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-secondary)' }}>{text}</p>
    </div>
  );
}