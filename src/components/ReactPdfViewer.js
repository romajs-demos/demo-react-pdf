import './ReactPdfViewer.css';
import {Document, Page, pdfjs} from 'react-pdf';
import {range} from '../utils';
import React, {Fragment} from 'react';
import weblog from 'webpack-log';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const log = weblog({name: 'react-pdf-viewer'})

class PdfPage extends React.Component {

  constructor(props){
    super(props)

    log.info("props", props);

    this.state = {
      currentPage: 1
    }
  }

  nextPage = () => {
    const {currentPage} = this.state;
    this.setState({currentPage: Math.min(currentPage + 1, this.props.numPages)}, () => {
      log.info('nextPage', this.state.currentPage)
    })

  }

  prevPage = () => {
    const {currentPage} = this.state;
    this.setState({currentPage: Math.max(currentPage - 1, 1)})
  }

  render() {
    return (
      <Fragment>

        <div className='react-pdf-viewer-document__body'>
          <div className='arrow-left' onClick={this.prevPage}/>
          <Page
            className='react-pdf-viewer-page'
            pageNumber={this.state.currentPage}
            renderTextLayer={false}
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
    url: '/assets/pdf/report_large_2.pdf',
    reload: true
  }

  componentDidMount() {
    pdfjs.getDocument(this.state.url).then(async (document) => {
      const data = await document.getData();
      log.info('data', data)
      this.setState({pdfData: data, numPages: document.numPages})
    })
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

    log.info('#render, url:', url)

    return (
      <div className='react-pdf-viewer'>
        <form className='react-pdf-viewer-form'>
          <label htmlFor='url'>URL:</label>
          <input type="text" name='url' value={url} onChange={this.updateUrl}/>
          <input type="button" name='fetch-url' value='Fetch' onClick={this.fetchUrl}/>
        </form>
        <p className='react-pdf-viewer-info'>Please verify if URL input accept CORS (Access-Control-Allow-Origin: *)</p>
        {url ? (
          <Document
            className='react-pdf-viewer-document'
            file={{data: pdfData}}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <PdfPage numPages={numPages}/>
          </Document>
        ) : (
          <p className='react-pdf-viewer-info'>Please enter URL</p>
        )}
        <p className='react-pdf-viewer-footer'>demo-react-pdf © 2019</p>
      </div>
    )
  }
}

export default ReactPdfViewer
