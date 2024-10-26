// src/App.tsx
import { ThemeProvider } from './providers/ThemeProvider';
import { WizardProvider } from './providers/WizardProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import { AppRouter } from './router';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider>
      <WizardProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </WizardProvider>
    </ThemeProvider>
  );
}

export default App;