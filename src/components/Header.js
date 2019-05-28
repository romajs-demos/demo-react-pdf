import PropTypes from 'prop-types';
import React from 'react';

const Header = ({ children }) => (
  <div style={{ margin: 0 }}>
    {children}
  </div>
);

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;
