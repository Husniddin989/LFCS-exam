import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Module from './pages/Module';
import ModuleTest from './pages/ModuleTest';
import ModuleLabTest from './pages/ModuleLabTest';
import Lesson from './pages/Lesson';
import Exam from './pages/Exam';
import RealTerminal from './pages/RealTerminal';

function App() {
  return (
    <ProgressProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="module/:moduleId" element={<Module />} />
            <Route path="module/:moduleId/test" element={<ModuleTest />} />
            <Route path="module/:moduleId/lab-test" element={<ModuleLabTest />} />
            <Route path="module/:moduleId/lesson/:lessonId" element={<Lesson />} />
            <Route path="exam" element={<Exam />} />
            <Route path="terminal" element={<RealTerminal />} />
          </Route>
        </Routes>
      </Router>
    </ProgressProvider>
  );
}

export default App;
