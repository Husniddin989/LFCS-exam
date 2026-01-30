import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Module from './pages/Module';
import Lesson from './pages/Lesson';
import Exam from './pages/Exam';

function App() {
  return (
    <ProgressProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="module/:moduleId" element={<Module />} />
            <Route path="module/:moduleId/lesson/:lessonId" element={<Lesson />} />
            <Route path="exam" element={<Exam />} />
          </Route>
        </Routes>
      </Router>
    </ProgressProvider>
  );
}

export default App;
