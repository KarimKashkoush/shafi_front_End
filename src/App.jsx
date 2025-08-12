import AppRouter from './routes/appRouter'
import { ToastContainer } from "react-toastify";


export default function App() {
      return (
            <>
                  <AppRouter />
                  <ToastContainer position="top-center" theme="colored" />
            </>
      )
}
