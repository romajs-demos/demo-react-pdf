import './SinglePageSideNavigator.css';
import { Page } from 'react-pdf';
import logger from '../../logger';
import PropTypes from 'prop-types';
import React from 'react';

const MAX_MOBILE_SCALE = 0.7;

const getPageDimensions = () => {
  const pageScale = window.outerWidth / window.outerHeight;
  return {
    pageHeigth: null,
    pageWidth: MAX_MOBILE_SCALE > pageScale ? window.outerWidth - 10 : null,
    pageScale,
  };
};

const getPageDefinition = (page, numPages) => ({
  currentPage: page,
  hasNext: page < numPages,
  hasPrevious: page > 1,
  nextPage: Math.min(page + 1, numPages),
  previousPage: Math.max(page - 1, 1),
});

class SinglePageSideNavigator extends React.Component {
  log = logger(this.constructor.name)

  state = {
    isRendering: false,
    ...getPageDefinition(1, this.props.numPages),
    ...getPageDimensions(),
  }

  componentDidMount () {
    window.addEventListener('resize', () => {
      const pageDimentions = getPageDimensions();
      this.log.info(`resolution=${window.outerWidth}x${window.outerHeight}, scale=${pageDimentions.pageScale}`);
      this.setState(pageDimentions, () => this.log.info(this.state));
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ ...getPageDefinition(1, nextProps.numPages) });
  }

  nextPage = () => {
    const { currentPage, hasNext } = this.state;
    if (hasNext) {
      this.setState({ isRendering: true, ...getPageDefinition(currentPage + 1, this.props.numPages) });
    }
  }

  prevPage = () => {
    const { currentPage, hasPrevious } = this.state;
    if (hasPrevious) {
      this.setState({ isRendering: true, ...getPageDefinition(currentPage - 1, this.props.numPages) });
    }
  }

  onRenderSuccess = () => {
    this.setState({ isRendering: false });

    if (!this.pageElement || !this.renderingElement) return;

    this.renderingElement.style.height = `${this.pageElement.offsetHeight}px`;
    this.renderingElement.style.width = `${this.pageElement.offsetWidth}px`;
  };

  render () {
    this.log.info('props:', this.props, 'state:', this.state);

    const { numPages } = this.props;
    const { currentPage, hasNext, hasPrevious, nextPage, previousPage, isRendering, pageHeigth, pageWidth } = this.state;
    return (
      <React.Fragment>
        <div className='single-page-side-navigator'>
          <div
            className={[
              'single-page-side-navigator__arrow',
              'single-page-side-navigator__arrow--left',
              !hasPrevious ? 'single-page-side-navigator__arrow--left--disabled' : '',
            ].join(' ')}
            onClick={this.prevPage}
            title={hasPrevious ? `Previous page ${previousPage}` : 'No previous page'}
          />
          <div
            className={`single-page-side-navigator__page--rendering ${!isRendering && 'hidden'}`}
            ref={ref => (this.renderingElement = ref)}
          />
          <Page
            className={`single-page-side-navigator__page ${isRendering && 'hidden'}`}
            height={pageHeigth}
            inputRef={ref => (this.pageElement = ref)}
            onRenderSuccess={this.onRenderSuccess}
            pageNumber={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={pageWidth}
          />
          <div
            className={[
              'single-page-side-navigator__arrow',
              'single-page-side-navigator__arrow--right',
              !hasNext ? 'single-page-side-navigator__arrow--right--disabled' : '',
            ].join(' ')}
            onClick={this.nextPage}
            title={hasNext ? `Next page ${nextPage}` : 'No next page'}
          />
        </div>
        <p className='single-page-side-navigator__pager'>Page {currentPage} of {numPages}</p>
      </React.Fragment>
    );
  }
}

SinglePageSideNavigator.propTypes = {
  numPages: PropTypes.number,
};

SinglePageSideNavigator.defaultProps = {
  numPages: 1,
};

export default SinglePageSideNavigator;
