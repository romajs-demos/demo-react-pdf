import './AllWithVerticalScroll.css';

import { Page } from 'react-pdf';
import { range } from '../../utils';
import React from 'react';

class AllWithVerticalScroll extends React.Component {
  state = {
    currentPage: 1,
    isRendering: false,
  }

  render () {
    return (
      <React.Fragment>
        {range(1, this.props.numPages).map(page => (
          <React.Fragment>
            <Page
              className='react-pdf-viewer-page'
              pageNumber={page}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
            <p className='react-pdf-viewer-pager'>Page {page} of {this.props.numPages}</p>
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
}

export default AllWithVerticalScroll;
