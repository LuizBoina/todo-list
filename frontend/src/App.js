import React from 'react';
import Header from './components/header/Header';
import { useRoutes } from 'hookrouter';
import routes from './routes';
import PageNotFound from './pages/pageNotFound/PageNotFound';

import './app.css';

function App() {
  const routeResult = useRoutes(routes);

  return (
    <div className='app'>
      <Header />
      <div className='app-body'>
        {routeResult || <PageNotFound />}
      </div>
    </div>
  );
}

export default App;
