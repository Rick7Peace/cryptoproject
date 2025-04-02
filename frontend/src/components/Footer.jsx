import React from 'react';

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Crypto Portfolio App. All rights reserved.</p>
      <nav>
        <ul>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;