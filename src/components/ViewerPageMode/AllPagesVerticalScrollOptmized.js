
import './AllPagesVerticalScrollOptmized.css';
import { Page } from 'react-pdf';
import { range } from '../../utils';
import logger from '../../logger';
import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash.debounce';

class AllPagesVerticalScrollOptmized extends React.Component {
  log = logger(this.constructor.name)

  boundaries = []

  blankRefs = []

  state = {
    isRendering: false,
    show: [],
  }

  updateShow = debounce(() => {
    const { pageYOffset: topOffset, innerHeight } = window;
    const bottomOffset = topOffset + innerHeight;

    console.log('scroll:', { topOffset, bottomOffset });

    const show = this.boundaries.map(({ pageIndex, ...boundary }) => ({
      pageIndex,
      show: bottomOffset > boundary.top && topOffset < boundary.bottom,
    }));

    console.log(show);

    this.setState({ show });
  }, 100);

  componentDidMount () {
    this.updateShow();
    window.addEventListener('scroll', this.updateShow);
  }

  onLoadSuccess = pageIndex => page => {
    const { pageNumber, height, width } = page;
    const object = { pageNumber, height, width };

    const blankRef = this.blankRefs[pageIndex];

    blankRef.style.height = `${height}px`;
    blankRef.style.width = `${width}px`;

    const { bottom, top } = blankRef.getBoundingClientRect();
    this.boundaries.push({ bottom, pageIndex, top });

    console.log('onLoadSuccess', !!blankRef, { bottom, top });
  }

  render () {
    const { numPages } = this.props;
    const { isRendering, show } = this.state;
    return (
      <div className='apvso__pages'>
        {range(1, numPages).map((pageNumber, pageIndex) => (
          <div className='apvso__page' key={pageNumber}>
            <div
              className={`apvso__page-blank`}
              ref={ref => this.blankRefs.push(ref)}
            >
              <p>pageIndex: {pageIndex}</p>
              <p>show: {JSON.stringify(show.find(s => s.pageIndex === pageIndex))}</p>
            </div>
            <Page
              className={`apvso__page-content hidden ${isRendering && 'hidden'}`}
              // inputRef={ref => (this.pageElement = ref)}
              // onRenderSuccess={this.onRenderSuccess}
              onLoadSuccess={this.onLoadSuccess(pageIndex)}
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
            {/* <p className='apvso__pager'>Page {page} of {numPages}</p> */}
          </div>
        ))}
      </div>
    );
  }
}

AllPagesVerticalScrollOptmized.propTypes = {
  numPages: PropTypes.number,
};

AllPagesVerticalScrollOptmized.defaultProps = {
  numPages: 1,
};

export default AllPagesVerticalScrollOptmized;
