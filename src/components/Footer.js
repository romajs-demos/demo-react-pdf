import './Footer.css';
import PropTypes from 'prop-types';
import React from 'react';

const Footer = ({ children }) => (
  <div className='footer'>
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Footer;
