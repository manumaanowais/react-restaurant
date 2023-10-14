import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Tables from './Tables';
import Report from './Report';
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import SignIn from "./components/auth/Signin"
import SignUp from "./components/auth/Signup"
import ForgotPassword from "./ForgotPassword"
// import AddUser from "./AddUser"
import AddCash from "./AddCash"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/adduser" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        {/* <Route path="/adduser" element={<AddUser />} /> */}
        <Route path="/order" element={<Home />} />
        <Route path="/order/:id" element={<Home />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/table/:tableId" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/addcash" element={<AddCash />} />
      </Routes>
    </Router>
  );
}

export default App;
