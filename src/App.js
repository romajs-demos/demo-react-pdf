import Footer from './components/Footer';
import Page from './pages/Page';
import React from 'react';
// import Header from './components/Header';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';

function App () {
  // const [showSidebar, updateShowSidebar] = React.useState(false);
  return (
    <React.Fragment>
      {/* <Header>
        <Navbar
          title='Demo React PDF'
          toggleSidebar={updateShowSidebar}
        />
      </Header>
      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={updateShowSidebar}
      /> */}
      <Page />
      <Footer>
        <p>demo-react-pdf © 2019</p>
      </Footer>
    </React.Fragment>
  );
}

export default App;
