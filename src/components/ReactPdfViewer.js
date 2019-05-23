import './ReactPdfViewer.css';
import {Document, Page, pdfjs} from 'react-pdf';
import {range} from '../utils';
import React, {Fragment} from 'react';
import weblog from 'webpack-log';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const log = weblog({name: 'react-pdf-viewer'})

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
    this.setState({isRendering: true, currentPage: Math.min(currentPage + 1, this.props.numPages)}, () => {
    })
  }

  prevPage = () => {
    const {currentPage} = this.state;
    this.setState({isRendering: true, currentPage: Math.max(currentPage - 1, 1)})
  }

  onRenderSuccess = (e) => {
    this.setState({isRendering: false});

    if(!this.pageElement || !this.renderingElement) return;

    this.renderingElement.style.height = `${this.pageElement.offsetHeight}px`;
    this.renderingElement.style.width = `${this.pageElement.offsetWidth}px`;

    log.info(this.pageElement.style)
  };


  render() {
    return (
      <Fragment>

        <div className='react-pdf-viewer-document__body'>
          <div className='arrow-left' onClick={this.prevPage}/>
          <div ref={ ref => this.renderingElement = ref} className={`react-pdf-viewer-page--rendering ${!this.state.isRendering && 'hidden'}`}/>
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


class ReactPdfViewer extends React.Component {
  state = {
    documentLoaded: false,
    numPages: 0,
    currentPage: 1,
    reload: true
  }

  constructor() {
    super()
    this._doc = '/assets/pdf/report_large_2.pdf'
  }

  onDocumentLoadSuccess = ({numPages, fingerprint}) => {
    this.setState({numPages});
  }

  updateUrl = (event) => {
    const {value: url} = event.target
    log.info('url:', url)
    this.setState({url, documentLoaded: false, reload: false})
  }

  fetchUrl = () => {
    log.info('fetchUrl')
    this.setState({numPages: 0, documentLoaded: false, reload: true})
  }

  render() {
    const {numPages, url, pdfData} = this.state

    log.info('#render, url:', this._doc);

    return (
      <div className='react-pdf-viewer'>
        <form className='react-pdf-viewer-form'>
          <label htmlFor='url'>URL:</label>
          <input type="text" name='url' value={url} onChange={this.updateUrl}/>
          <input type="button" name='fetch-url' value='Fetch' onClick={this.fetchUrl}/>
        </form>
        <p className='react-pdf-viewer-info'>Please verify if URL input accept CORS (Access-Control-Allow-Origin: *)</p>
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
