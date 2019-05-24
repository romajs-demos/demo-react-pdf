import './ReactPdfViewer.css';
import {Document, Page, pdfjs} from 'react-pdf';
import React, {Fragment} from 'react';
import weblog from 'webpack-log';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const log = weblog({name: 'react-pdf-viewer'});

class PdfPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isRendering: false,
      currentPage: 1
    }

    this._page = {
      h: 0,
      w: 0
    }
  }

  nextPage = () => {
    const {currentPage} = this.state;

    const newPage  = Math.min(currentPage + 1, this.props.numPages);
    if(newPage !== currentPage) {
      this.setState({isRendering: true, currentPage: newPage})
    }
  }

  prevPage = () => {
    const {currentPage} = this.state;
    const newPage  = Math.max(currentPage - 1, 1);
    if(newPage !== currentPage) {
      this.setState({isRendering: true, currentPage: newPage})
    }
  }

  onRenderSuccess = () => {
    this.setState({isRendering: false});

    if (!this.pageElement || !this.renderingElement) return;

    this.renderingElement.style.height = `${this.pageElement.offsetHeight}px`;
    this.renderingElement.style.width = `${this.pageElement.offsetWidth}px`;

    log.info(this.pageElement.style)
  };


  render() {
    return (
      <Fragment>

        <div className='react-pdf-viewer-document__body'>
          <div className='arrow-left' onClick={this.prevPage}/>
          <div ref={ref => this.renderingElement = ref}
               className={`react-pdf-viewer-page--rendering ${!this.state.isRendering && 'hidden'}`}/>
          <Page
            inputRef={ref => this.pageElement = ref}
            className={`react-pdf-viewer-page ${this.state.isRendering && 'hidden'}`}
            pageNumber={this.state.currentPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onRenderSuccess={this.onRenderSuccess}
          />
          <div className='arrow-right' onClick={this.nextPage}/>
        </div>
        <p className='react-pdf-viewer-pager'>Page {this.state.currentPage} of {this.props.numPages}</p>
      </Fragment>
    )
  }
}


const PdfPath = '/assets/pdf';

const PdfOptions = [
  {
    url: `${PdfPath}/report_light_text_only.pdf`,
    name: 'Simple Text Document (2 pages)'
  },
  {
    url: `${PdfPath}/report_real_world.pdf`,
    name: 'Test Exam (1 page)'
  },
  {
    url: `${PdfPath}/report_medium.pdf`,
    name: 'Images and Texts (9 pages)'
  },
  {
    url: `${PdfPath}/report_huge.pdf`,
    name: 'Huge Document (98 pages)'
  }
];

class ReactPdfViewer extends React.Component {

  constructor() {
    super()

    const initialDoc = PdfOptions[0].url
    this._doc = initialDoc
    this.state = {
      numPages: 0,
      selectedDoc: initialDoc
    }
  }

  onDocumentLoadSuccess = ({numPages}) => {
    this.setState({numPages});
  }

  handleDocSelect = ({target}) => {
    const pdfUrl = target.value;
    this._doc = pdfUrl;
    this.setState({selectedDoc: pdfUrl})
  }

  render() {
    const {numPages} = this.state;

    log.info('#render, url:', this._doc);

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
          <PdfPage numPages={numPages}/>
        </Document>

        <p className='react-pdf-viewer-footer'>demo-react-pdf © 2019</p>
      </div>
    )
  }
}

export default ReactPdfViewer
