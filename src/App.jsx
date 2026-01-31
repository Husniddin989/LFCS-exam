import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Module from './pages/Module';
import Lesson from './pages/Lesson';
import Exam from './pages/Exam';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            {/* Auth routes (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main app routes (with layout) */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="module/:moduleId" element={<Module />} />
              <Route path="module/:moduleId/lesson/:lessonId" element={<Lesson />} />
              <Route path="exam" element={<Exam />} />
            </Route>
          </Routes>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
