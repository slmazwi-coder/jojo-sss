import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Staff } from './pages/Staff';
import { Documents } from './pages/Documents';
import { Achievements } from './pages/Achievements';
import { Sport } from './pages/Sport';
import { Activities } from './pages/Activities';
import { Admissions } from './pages/Admissions';
import { Contact } from './pages/Contact';
import { StudentLogin } from './pages/StudentLogin';
import { StudentPortal } from './pages/StudentPortal';

// Admin imports
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/Dashboard';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { NewsEditor } from './admin/editors/NewsEditor';
import { AboutEditor } from './admin/editors/AboutEditor';
import { AchievementsEditor } from './admin/editors/AchievementsEditor';
import { DocumentsEditor } from './admin/editors/DocumentsEditor';
import { ExtraCurricularEditor } from './admin/editors/ExtraCurricularEditor';
import { ApplicationsEditor } from './admin/editors/ApplicationsEditor';
import { ContactEditor } from './admin/editors/ContactEditor';
import { StudentDocsEditor } from './admin/editors/StudentDocsEditor';
import { StaffManager } from './admin/StaffManager';

const HomePage = () => (
  <>
    <Hero />
    <NewsSection />
    <Home />
  </>
);

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PageShell><HomePage /></PageShell>} />
        <Route path="/about" element={<PageShell><About /></PageShell>} />
        <Route path="/staff" element={<PageShell><Staff /></PageShell>} />
        <Route path="/documents" element={<PageShell><Documents /></PageShell>} />
        <Route path="/achievements" element={<PageShell><Achievements /></PageShell>} />
        <Route path="/sport" element={<PageShell><Sport /></PageShell>} />
        <Route path="/activities" element={<PageShell><Activities /></PageShell>} />
        <Route path="/admissions" element={<PageShell><Admissions /></PageShell>} />
        <Route path="/contact" element={<PageShell><Contact /></PageShell>} />

        {/* Student portal routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student" element={<StudentPortal />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<ProtectedRoute section="news"><NewsEditor /></ProtectedRoute>} />
          <Route path="about" element={<ProtectedRoute section="about"><AboutEditor /></ProtectedRoute>} />
          <Route path="achievements" element={<ProtectedRoute section="achievements"><AchievementsEditor /></ProtectedRoute>} />
          <Route path="documents" element={<ProtectedRoute section="documents"><DocumentsEditor /></ProtectedRoute>} />
          <Route path="extra-curricular" element={<ProtectedRoute section="extra-curricular"><ExtraCurricularEditor /></ProtectedRoute>} />
          <Route path="applications" element={<ProtectedRoute section="applications"><ApplicationsEditor /></ProtectedRoute>} />
          <Route path="student-documents" element={<ProtectedRoute section="student-documents"><StudentDocsEditor /></ProtectedRoute>} />
          <Route path="contact" element={<ProtectedRoute section="contact"><ContactEditor /></ProtectedRoute>} />
          <Route path="staff" element={<ProtectedRoute section="staff"><StaffManager /></ProtectedRoute>} />
        </Route>
      </Routes>

      <ChatbotWidget />
    </Router>
  );
}
