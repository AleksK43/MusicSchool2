// src/App.js
import React, { useState } from 'react';
import { ArtyzLoadingAnimation } from './components/common/Loading';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/public/Home/Home';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthProvider>
      <>
        {isLoading && (
          <ArtyzLoadingAnimation 
            onComplete={() => setIsLoading(false)}
          />
        )}
        
        {!isLoading && <Home />}
      </>
    </AuthProvider>
  );
}

export default App;