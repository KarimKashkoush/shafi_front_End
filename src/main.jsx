import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import AppRouter from './routes/appRouter'

createRoot(document.getElementById('root')).render(
  <AppRouter />
)
