import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    return(
        <div className="min-h-screen bg-black flex flex-col justify-center items-center gap-6">
          <h1 className="text-white text-4xl">Welcome to FixFlow</h1>
          <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => navigate('/signup')}>Get Started</button>
        </div>
    )
}