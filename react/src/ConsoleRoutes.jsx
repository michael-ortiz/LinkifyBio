import LinksPage from './pages/console/links/LinksPage';
import ActionsPage from './pages/console/ActionsPage';
import LinkEditorPage from './pages/console/links/LinkEditorPage';
import { Route, Routes } from 'react-router-dom';
import LinkAddPage from './pages/console/links/LinkAddPage';
import SocialLinksPage from './pages/console/social-icons/SocialLinksPage';
import SocialLinkEditorPage from './pages/console/social-icons/SocialLinkEditorPage';
import SocialLinkAddPage from './pages/console/social-icons/SocialLinkAddPage';
import PageSettings from './pages/console/page-settings/PageSettings';
import CreatePage from './pages/console/create-page/CreatePage';
import AliasPage from './pages/console/create-page/AliasPage';
import PageColors from './pages/console/page-settings/PageColors';
import MainPage from './pages/console/MainPage';
import PageAndLinkViews from './pages/console/views/PageAndLinkViews';
import { GlobalProvider } from './context/GlobalContext';


export default function ConsoleRoutes() {
    return (
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

    );
}