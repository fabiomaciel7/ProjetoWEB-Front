import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import Sessions from './pages/Sessions';
import Profile from './pages/Profile';
import UsersList from './pages/UsersList'
import TaskView from './pages/TaskView'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createTask" element={<CreateTask />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/usersList" element={<UsersList />} />
        <Route path="/task/:id" element={<TaskView />} />
      </Routes>
    </Router>
  );
};

export default App;
