import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App';
import { AuthContext, AuthProvider } from './context/Auth.Context';
createRoot(document.getElementById('root')).render(
      <AuthProvider>
            <App />
      </AuthProvider>
)
