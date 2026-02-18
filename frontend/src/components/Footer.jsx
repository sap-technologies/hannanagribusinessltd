import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          Designed & Powered by{' '}
          <a 
            href="https://www.sap-technologies.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            SAP Technologies Uganda
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
