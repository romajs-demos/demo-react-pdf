import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const Navbar = ({ classes, title, toggleSidebar }) => (
  <div className={classes.root}>
    <AppBar position='static'>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color='inherit'
          aria-label='Menu'
          onClick={() => toggleSidebar(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' color='inherit' className={classes.grow}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
);

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  toggleSidebar: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  title: '',
};

export default withStyles(styles)(Navbar);
