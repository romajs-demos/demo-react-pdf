import './Page.css';
import logger from '../logger';
import PdfOptions from '../utils/PdfOptions';
import PdfViewer from '../components/PdfViewer';
import React from 'react';

class Page extends React.Component {
  log = logger(this.constructor.name)

  state = {
    numPages: 0,
    url: PdfOptions[3].url,
  };

  handleDocSelect = ({ target }) => {
    const url = target.value;
    this.setState({ url });
  }

  render () {
    this.log.info('props:', this.props, 'state:', this.state);

    return (
      <div className='demo-react-pdf__content'>
        <form className='demo-react-pdf__form'>
          <label htmlFor='url'>Document:</label>
          <select
            name='url'
            onChange={this.handleDocSelect}
            value={this.state.url}
          >
            {
              PdfOptions.map(doc => (
                <option key={doc.url} value={doc.url}>
                  {doc.name}
                </option>
              ))
            }
          </select>
        </form>
        <PdfViewer url={this.state.url} />
      </div>
    );
  }
}

export default Page;
