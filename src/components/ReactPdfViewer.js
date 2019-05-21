import './ReactPdfViewer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { range } from '../utils';
import React from 'react';
import weblog from 'webpack-log';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const log = weblog({ name: 'react-pdf-viewer' })

class ReactPdfViewer extends React.Component {
  state = {
    documentLoaded: false,
    numPages: 0,
    url: '/assets/pdf/sample.pdf'
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document
    log.info('numPages:', numPages)

    this.setState({ numPages, documentLoaded: true })
  }

  updateUrl = (event) => {
    log.info('event:', event)
    this.setState({ url: event.target.value })
  }

  fetchUrl = () => {
    log.info('fetchUrl')
    this.setState({ numPages: 0, documentLoaded: false })
  }

  shouldComponentUpdate(_, nextState) {
    return this.state.documentLoaded !== nextState.documentLoaded ? nextState : null
  }

  render () {
    const { numPages, url } = this.state

    log.info('#render, url:', url)

    if (!url) {
      return <React.Fragment />
    }

    return (
      <div className='react-pdf-viewer'>
        <form className='react-pdf-viewer-form'>
          <label for='url'>URL:</label>
          <input type="text" name='url' value={url} onChange={this.updateUrl} />
          <input type="button" name='fetch-url' value='Fetch' onClick={this.fetchUrl} />
        </form>
        <p className='react-pdf-viewer-info'>Please verify if URL input accept CORS (Access-Control-Allow-Origin: *)</p>
        <hr/>
        <Document
          className='react-pdf-viewer-document'
          file={{ url }}
          onLoadSuccess={this.onDocumentLoadSuccess}
          renderMode='svg'
        >
          {range(1, numPages).map(page => (
            <React.Fragment>
              <Page
                className='react-pdf-viewer-page'
                pageNumber={page}
                renderMode='svg'
                renderTextLayer={false}
              />
              <p className='react-pdf-viewer-pager'>Page {page} of {numPages}</p>
            </React.Fragment>
          ))}
        </Document>
        <hr/>
        <p className='react-pdf-viewer-footer'>demo-react-pdf © 2019</p>
      </div>
    )
  }
}

export default ReactPdfViewer
