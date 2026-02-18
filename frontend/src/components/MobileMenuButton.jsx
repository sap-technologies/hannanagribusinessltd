import './MobileMenuButton.css';

function MobileMenuButton({ onClick }) {
  return (
    <button className="mobile-menu-btn" onClick={onClick} aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

export default MobileMenuButton;
