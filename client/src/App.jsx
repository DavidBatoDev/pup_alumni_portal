import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import './App.css';
import Login from './pages/Login/Login'
import Signup from './pages/SignUp/signup'
import './global.css'; 

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
    </Router>
  );
}

export default App;
