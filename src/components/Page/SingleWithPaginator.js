import './SingleWithPaginator.css';
import { Page } from 'react-pdf';
import log from '../../log';
import React, { Fragment } from 'react';

const MAX_MOBILE_SCALE = 0.7;

const getPageDimensions = () => {
  const scale = window.outerWidth / window.outerHeight;
  log.debug(scale, `${window.outerWidth}x${window.outerHeight}`);
  return {
    pageHeigth: null,
    pageWidth: MAX_MOBILE_SCALE > scale ? window.outerWidth - 10 : null,
  };
};

class SingleWithPaginator extends React.Component {
    state = {
      currentPage: 1,
      isRendering: false,
      ...getPageDimensions(),
    }

    componentDidMount () {
      window.addEventListener('resize', () => {
        this.setState(getPageDimensions(), () => log.debug(this.state));
      });
    }

    nextPage = () => {
      const { currentPage, } = this.state;
      const newPage = Math.min(currentPage + 1, this.props.numPages);
      if (newPage !== currentPage) {
        this.setState({ isRendering: true, currentPage: newPage, });
      }
    }

    prevPage = () => {
      const { currentPage, } = this.state;
      const newPage = Math.max(currentPage - 1, 1);
      if (newPage !== currentPage) {
        this.setState({ isRendering: true, currentPage: newPage, });
      }
    }

    onRenderSuccess = () => {
      this.setState({ isRendering: false, });

      if (!this.pageElement || !this.renderingElement) return;

      this.renderingElement.style.height = `${this.pageElement.offsetHeight}px`;
      this.renderingElement.style.width = `${this.pageElement.offsetWidth}px`;

      log.info(this.pageElement.style);
    };

    render () {
      const { pageHeigth, pageWidth, } = this.state;
      return (
        <Fragment>
          <div className='react-pdf-viewer-document__body'>
            <div className='arrow-left' onClick={this.prevPage} />
            <div
              className={`react-pdf-viewer-page--rendering ${!this.state.isRendering && 'hidden'}`}
              ref={ref => (this.renderingElement = ref)}
            />
            <Page
              className={`react-pdf-viewer-page ${this.state.isRendering && 'hidden'}`}
              height={pageHeigth}
              inputRef={ref => (this.pageElement = ref)}
              onRenderSuccess={this.onRenderSuccess}
              pageNumber={this.state.currentPage}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={pageWidth}
            />
            <div className='arrow-right' onClick={this.nextPage} />
          </div>
          <p className='react-pdf-viewer-pager'>Page {this.state.currentPage} of {this.props.numPages}</p>
        </Fragment>
      );
    }
}

export default SingleWithPaginator;
