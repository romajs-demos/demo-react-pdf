import './AllPagesVerticalScrollOptmized.css';
import { Page } from 'react-pdf';
import { range } from 'range';
import logger from '../../logger';
import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash.debounce';

class AllPagesVerticalScrollOptmized extends React.Component {
  log = logger(this.constructor.name)

  rects = []

  state = {
    isRendering: false,
    // page: {
    //   height: 800,
    //   width: 400,
    // },
    pages: [],
    show: [],
  }

  updateShow = debounce(() => {
    const { page: { height: pageHeight } } = this.state;
    const { pageYOffset, innerHeight } = window;

    const offsetFit = Math.max(pageHeight - innerHeight, 0);
    const wo = pageYOffset - offsetFit - (pageHeight * 1);
    const wi = pageYOffset + innerHeight + offsetFit + (pageHeight * 1);

    console.log('---------------------------------------------------');
    console.log('scrollTo:', { offsetFit, pageHeight, pageYOffset, wo, wi });

    // const show = this.rects.map(({ index, offsetBottom, offsetTop }) => ({
    //   index,
    //   offsetBottom,
    //   offsetTop,
    //   show: pageOffsetBprevStateprevStateottom > offsetTop && pageOffsetTop < offsetBottom,
    // }));

    // console.log('show:');

    // show.forEach(s => console.log(s));

    this.setState(prevState => ({
      pages: prevState.pages.map(({ pageNumber }, index) => {
        const { offsetTop: po, offsetBottom: pi } = this.rects[index];

        const topRule = po > wo && po < wi;
        const bottomRule = pi > wo && pi < wi;

        const show = topRule || bottomRule;
        // console.log({ pageNumber, show });

        return {
          pageNumber,
          show,
          page: { po, pi },
          window: { wo, wi },
          offsetFit,
          topRule: `${wo} < ${po} < ${wi} = ${topRule}`,
          bottomRule: `${wo} < ${pi} < ${wi} = ${bottomRule}`,
        };
      }),
    }), () => {
      const showingPages = this.state.pages.filter(page => page.show).map(page => page.pageNumber);
      console.log('showingPages:', showingPages.join(', '));
    });
  }, 100);

  componentDidMount () {
    // this.updateShow();
    window.addEventListener('scroll', this.updateShow);
  }

  componentDidUpdate () {
    // this.pages = range(2, this.props.numPages + 1).map(pageNumber => ({
    //   blankRef: React.createRef(),
    //   pageNumber,
    // }));
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ pages: range(1, nextProps.numPages + 1).map(pageNumber => ({
      isFirst: pageNumber === 1,
      pageNumber,
      show: false,
    })) }, () => {
      this.updatedRects();
      this.updateShow();
    });
  }

  updatedRects = () => {
    this.rects = [ ...document.getElementsByClassName('apvso__page-container') ]
      .map(({ offsetHeight, offsetTop }, index) => ({ index, offsetTop, offsetBottom: offsetHeight + offsetTop }));
    // .map(blank => blank.getBoundingClientRect())
    // .map(({ top: offsetTop, bottom: offsetBottom }, index) => ({ index, offsetTop, offsetBottom }));
    console.log('rects:');
    this.rects.forEach(rect => console.log(rect));
  }

  onPageLoadSuccess = isFirst => page => {
    const { height, width } = page;
    if (isFirst) {
      this.setState({ page: { height, width } }, () => {
        this.updatedRects();
        this.updateShow();
      });
    }
  }

  render () {
    const { numPages } = this.props;
    const { isRendering, pages, page, show } = this.state;

    const pageStyle = page ? {
      height: `${page.height}px`,
      width: `${page.width}px`,
    } : {};

    // pages.forEach(page => console.log(page));

    return (
      <div className='apvso__pages'>
        {pages.map(({ isFirst, pageNumber, show, ...page }) => (
          <div className='apvso__page-container' key={pageNumber} style={pageStyle}>
            {(isFirst || show) && (
              <Page
                className={`apvso__page`}
                onLoadSuccess={this.onPageLoadSuccess(isFirst)}
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            )}
            {/* <p className='apvso__pager'>Page {page} of {numPages}</p> */}
          </div>
        ))}
      </div>
    );
  }
}

AllPagesVerticalScrollOptmized.propTypes = {
  numPages: PropTypes.number,
};

AllPagesVerticalScrollOptmized.defaultProps = {
  numPages: 1,
};

export default AllPagesVerticalScrollOptmized;
