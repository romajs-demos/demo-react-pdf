import { Document, Page, pdfjs } from 'react-pdf'
import querystring from 'querystring'
import React from 'react'

import './ReactPdfViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const range = (i, n) => [...Array(n).keys()].map(_ => _ + i)

class ReactPdfViewer extends React.Component {
  state = {
    numPages: 0,
    url: null
  }

  componentDidMount () {
    const { search } = window.location || { search: '?url=/assets/pdf/sample.pdf' }
    console.log('search:', search)

    const params = querystring.parse(search.replace(/^\?/, ''))
    console.log('params:', params)

    const { url = '/assets/pdf/sample.pdf' } = params
    this.setState({ url })
  }

  shouldComponentUpdate(_, nextState) {
    const { numPages } = this.state
    return (numPages === 0) || (numPages !== nextState.numPages) ? nextState : null
  }

  onDocumentLoadSuccess = (document) => {
    console.log('document:', document)
    const { numPages } = document
    console.log('numPages:', numPages)
    this.setState({ numPages })
  }

  render () {
    const { numPages, url } = this.state

    console.log('#render, url:', url)

    if (!url) {
      return <React.Fragment />
    }

    return (
      <div> 
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
        <p className='react-pdf-viewer-footer'>demo-react-pdf © 2019</p>
      </div>
    )
  }
}

export default ReactPdfViewer
