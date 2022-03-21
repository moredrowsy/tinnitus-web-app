import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';

import './App.css';
import { Home, Mixes, SignIn, SignUp, Sounds } from './routes';
import Navbar from './Navbar';

const navigation = [
  { name: 'Dashboard', path: '/', exact: true },
  { name: 'Sounds', path: '/sounds', exact: true },
  { name: 'Mixes', path: '/mixes', exact: true },
];

function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <Navbar navigation={navigation} user={user} />
      <div id='app' className='bg-slate-100'>
        <div className='max-w-7xl mx-auto'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/mixes' element={<Mixes />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/sounds' element={<Sounds />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
