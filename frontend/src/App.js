import React, { useState } from 'react';
import { ArtyzLoadingAnimation } from './components/common/Loading';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from './components/common/Notifications';
import AppRouter from './components/AppRouter';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="App">
          {isLoading && (
            <ArtyzLoadingAnimation 
              onComplete={() => setIsLoading(false)}
            />
          )}
          
          {!isLoading && <AppRouter />}
          <ToastContainer />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;