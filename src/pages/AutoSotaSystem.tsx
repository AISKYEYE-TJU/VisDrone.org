import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../autosota/components/Layout';
import Home from '../autosota/components/Home';
import Papers from '../autosota/components/Papers';
import Datasets from '../autosota/components/Datasets';
import Algorithms from '../autosota/components/Algorithms';
import Leaderboard from '../autosota/components/Leaderboard';
import HumanMachineResearch from '../autosota/components/HumanMachineResearch';
import ResearchAreas from '../autosota/components/ResearchAreas';
import ResearchAreaDetail from '../autosota/components/ResearchAreaDetail';
import TestComponent from '../autosota/components/TestComponent';
import SimpleResearchAreaDetail from '../autosota/components/SimpleResearchAreaDetail';

// AutoSota 系统的主组件，使用 /autosota 作为基础路径
function AutoSotaSystem() {
  return (
    <Router basename="/autosota">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="areas" element={<ResearchAreas />} />
          <Route path="areas/:areaId" element={<ResearchAreaDetail />} />
          <Route path="areas/:areaId/:subAreaId" element={<ResearchAreaDetail />} />
          <Route path="test/:areaId/:subAreaId" element={<TestComponent />} />
          <Route path="simple/:areaId/:subAreaId" element={<SimpleResearchAreaDetail />} />
          <Route path="papers" element={<Papers />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="algorithms" element={<Algorithms />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="ai4r" element={<HumanMachineResearch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AutoSotaSystem;
