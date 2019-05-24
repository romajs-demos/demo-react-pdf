import './Viewer.css';
import { Document, pdfjs } from 'react-pdf';
import log from '../log';
import React from 'react';
import SingleWithPaginator from './Page/SingleWithPaginator';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfPath = '/assets/pdf';

const PdfOptions = [
  {
    url: `${PdfPath}/report_light_text_only.pdf`,
    name: 'Simple Text Document (2 pages)',
  },
  {
    url: `${PdfPath}/report_real_world.pdf`,
    name: 'Test Exam (1 page)',
  },
  {
    url: `${PdfPath}/report_medium.pdf`,
    name: 'Images and Texts (9 pages)',
  },
  {
    url: `${PdfPath}/report_huge.pdf`,
    name: 'Huge Document (98 pages)',
  }
];

class Viewer extends React.Component {
  constructor () {
    super();

    const initialDoc = PdfOptions[0].url;
    this._doc = initialDoc;
    this.state = {
      numPages: 0,
      selectedDoc: initialDoc,
    };
  }

  onDocumentLoadSuccess = document => {
    const { numPages, } = document;
    log.info('document:', document);
    this.setState({ numPages, }, this.props.onLoad(numPages));
  }

  handleDocSelect = ({ target, }) => {
    const pdfUrl = target.value;
    this._doc = pdfUrl;
    this.setState({ selectedDoc: pdfUrl, });
  }

  render () {
    const { numPages, } = this.state;

    log.info('#render, url:', this._doc);
    log.info('props:', this.props);
    log.info('state:', this.state);

    return (
      <div className='react-pdf-viewer'>
        <form className='react-pdf-viewer-form'>
          <label htmlFor='url'>Document: </label>
          <select value={this.state.selectedDoc} onChange={this.handleDocSelect}>
            {
              PdfOptions.map(doc => <option value={doc.url}>{doc.name}</option>)
            }
          </select>
        </form>
        <Document
          className='react-pdf-viewer-document'
          file={this._doc}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <SingleWithPaginator numPages={numPages} />
        </Document>
      </div>
    );
  }
}

export default Viewer;
