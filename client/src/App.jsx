import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import './App.css';
import Login from './pages/Login/Login'
import './global.css'; 

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
