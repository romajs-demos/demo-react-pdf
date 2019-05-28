import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

export const Sidebar = ({ classes, showSidebar, toggleSidebar }) => (
  <Drawer open={showSidebar} onClose={() => toggleSidebar(false)}>
    <div role='button' onClick={() => toggleSidebar(false)}>
      <div className={classes.list} />
    </div>
  </Drawer>
);

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  showSidebar: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default withStyles(styles)(Sidebar);
