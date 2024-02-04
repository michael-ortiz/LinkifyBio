
import PublicPage from './pages/public/PublicPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

import PublicMainPage from './pages/public/PublicMainPage';
import ConsoleRoutes from './ConsoleRoutes';
import config from './congito/AwsExports.json';


Amplify.configure(config);

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicMainPage />} />
        <Route path="/:id" element={<PublicPage />} />
        <Route path="/console/*" element={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

            { import.meta.env.VITE_NODE_ENV === 'local' ? <ConsoleRoutes /> : 
            
            <Authenticator loginMechanisms={['email']} socialProviders={["google"]}>
              <ConsoleRoutes />
            </Authenticator> }

          </div>
        } />
      </Routes>
    </BrowserRouter>







  );
}