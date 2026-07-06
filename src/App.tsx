import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Story from './pages/Recit/Story';
import CreaturesList from './pages/Creatures/CreaturesList';
import CreatureDetail from './pages/Creatures/CreatureDetail';
import Journal from './pages/Journal/Journal';
import Cases from './pages/Cases/Cases';
import CaseDetail from './pages/Cases/CaseDetail';
import Search from './pages/Search/Search';
import { Analytics } from '@vercel/analytics/react';
import Admin from './pages/Admin/Admin';

export default function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/recit" element={<Story />} />
        <Route path="/creatures" element={<CreaturesList />} />
        <Route path="/creatures/:id" element={<CreatureDetail />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/cas" element={<Cases />} />
        <Route path="/cas/:id" element={<CaseDetail />} />
        <Route path="/recherche" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
    <Analytics />
    </>
  );
}
