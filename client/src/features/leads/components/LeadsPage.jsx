// client/src/features/leads/LeadsPage.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import LeadForm from './components/LeadForm';
import './styles/Leads.css';

const LeadsPage = () => {
  return (
    <div className="leads-page">
      <Routes>
        <Route path="/" element={<LeadList />} />
        <Route path="/new" element={<LeadForm />} />
        <Route path="/:id" element={<LeadDetail />} />
        <Route path="/:id/edit" element={<LeadForm />} />
      </Routes>
    </div>
  );
};

export default LeadsPage;