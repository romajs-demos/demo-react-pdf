import Footer from './components/Footer';
import Header from './components/Header';
import Navbar from './components/Navbar';
import React from 'react';
import Viewer from './components/Viewer';
import Sidebar from './components/Sidebar';

function App () {
  const title = 'Demo React PDF';
  const [showSidebar, updateShowSidebar] = React.useState(false);
  return (
    <React.Fragment>

      <Header>
        <Navbar
          title={title}
          toggleSidebar={updateShowSidebar}
        />
      </Header>
      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={updateShowSidebar}
      />
      <Viewer
        onLoad={() => {}}
      />
      <Footer>
        <p>demo-react-pdf © 2019</p>
      </Footer>
    </React.Fragment>
  );
}

export default App;
