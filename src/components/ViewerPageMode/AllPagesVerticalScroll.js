
import './AllPagesVerticalScroll.css';
import { Page } from 'react-pdf';
import { range } from '../../utils';
import logger from '../../logger';
import PropTypes from 'prop-types';
import React from 'react';

class AllPagesVerticalScroll extends React.Component {
  log = logger(this.constructor.name)

  render () {
    return (
      <React.Fragment>
        {range(1, this.props.numPages).map(page => (
          <React.Fragment>
            <Page
              className='all-pages-vertical-scroll__page'
              pageNumber={page}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
            <p className='all-pages-vertical-scroll__pager'>Page {page} of {this.props.numPages}</p>
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
}

AllPagesVerticalScroll.propTypes = {
  numPages: PropTypes.number,
};

AllPagesVerticalScroll.defaultProps = {
  numPages: 1,
};

export default AllPagesVerticalScroll;
