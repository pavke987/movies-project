import React from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout'
import Search from './containers/Search/Search';

function App() {
  return (
    <Layout>
      <Search />
    </Layout>
    
  );
}

export default App;
