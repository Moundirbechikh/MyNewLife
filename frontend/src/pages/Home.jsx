import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage';
import PagePrincipal from './PagePrincipal';
import ObjectivesPage from './ObjectivesPage';
import AgendaPage from './AgendaPage';

function Home() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PagePrincipal />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/object" element={<ObjectivesPage />} />
        <Route path="/agenda" element={<AgendaPage/>} />
      </Routes>
    </Router>
  );
}

export default Home;
