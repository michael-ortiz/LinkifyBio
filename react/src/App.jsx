import LinksPage from './pages/console/links/LinksPage';
import ActionsPage from './pages/console/ActionsPage';
import LinkEditorPage from './pages/console/links/LinkEditorPage';
import PublicPage from './pages/public/PublicPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import LinkAddPage from './pages/console/links/LinkAddPage';
import SocialLinksPage from './pages/console/social-icons/SocialLinksPage';
import SocialLinkEditorPage from './pages/console/social-icons/SocialLinkEditorPage';
import SocialLinkAddPage from './pages/console/social-icons/SocialLinkAddPage';
import PageSettings from './pages/console/page-settings/PageSettings';
import CreatePage from './pages/console/create-page/CreatePage';
import AliasPage from './pages/console/create-page/AliasPage';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

import config from './congito/AwsExports.json';
import PageColors from './pages/console/page-settings/PageColors';
import PublicMainPage from './pages/public/PublicMainPage';
import MainPage from './pages/console/MainPage';
import PageAndLinkViews from './pages/console/views/PageAndLinkViews';

Amplify.configure(config);

export default function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<PublicMainPage />} />
        <Route path="/:id" element={<PublicPage />} />
        <Route path="/console/*" element={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Authenticator loginMechanisms={['email']} socialProviders={["google"]}>
              <GlobalProvider>
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/actions" element={<ActionsPage />} />
                  <Route path="/links/view" element={<LinksPage />} />
                  <Route path="/link/editor" element={<LinkEditorPage />} />
                  <Route path="/link/add" element={<LinkAddPage />} />
                  <Route path="/social/view" element={<SocialLinksPage />} />
                  <Route path="/social/editor" element={<SocialLinkEditorPage />} />
                  <Route path="/social/add" element={<SocialLinkAddPage />} />
                  <Route path="/page/settings" element={<PageSettings />} />
                  <Route path="/page/colors" element={<PageColors />} />
                  <Route path="/page/create/alias" element={<AliasPage />} />
                  <Route path="/page/create/details" element={<CreatePage />} />
                  <Route path="/page/views" element={<PageAndLinkViews />} />
                </Routes>
              </GlobalProvider>
            </Authenticator>
          </div>
        } />
      </Routes>
    </Router>







  );
}