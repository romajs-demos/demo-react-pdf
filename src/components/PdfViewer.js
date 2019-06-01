import './PdfViewer.css';
import { Document, pdfjs } from 'react-pdf';
import logger from '../logger';
import PropTypes from 'prop-types';
import React from 'react';
import SinglePageSideNavigator from './ViewerPageMode/SinglePageSideNavigator';
import AllPagesVerticalScroll from './ViewerPageMode/AllPagesVerticalScroll';
import AllPagesVerticalScrollOptmized from './ViewerPageMode/AllPagesVerticalScrollOptmized';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PdfViewer extends React.Component {
  log = logger(this.constructor.name)

  state = {
    numPages: 0,
  };

  onDocumentLoadSuccess = document => {
    const { numPages } = document;
    this.log.info('onDocumentLoadSuccess:', document);
    this.setState({ numPages }, this.props.onLoad(numPages));
  }

  render () {
    this.log.info('props:', this.props, 'state:', this.state);

    const { url } = this.props;
    const { numPages } = this.state;

    return (
      <Document
        className='demo-react-pdf__viewer__document'
        file={url}
        onLoadSuccess={this.onDocumentLoadSuccess}
      >
        <AllPagesVerticalScrollOptmized numPages={numPages} />
      </Document>
    );
  }
}

PdfViewer.propTypes = {
  onLoad: PropTypes.func,
  url: PropTypes.string,
};

PdfViewer.defaultProps = {
  onLoad: () => null,
  url: '',
};

export default PdfViewer;
