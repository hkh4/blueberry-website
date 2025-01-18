import { lazy } from "react"
import { 
  BrowserRouter as Router,  
  Route, 
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuthContext } from "./../../hooks/useAuthContext"

const Document = lazy(() => import("./Document/Document"))
const Dashboard = lazy(() => import("./Dashboard/Dashboard"))
const Landing = lazy(() => import("./Landing/Landing"))
const Super = lazy(() => import("./Super/Super"))

function Home({ loginRef }) {

  const { user } = useAuthContext()

  return (
    <>

    {user ? (

      <Routes>

        <Route path="/documents/:id" element={<Document />}/>

        <Route path="/home" element={<Dashboard />}/>

        <Route path="/super" element={<Super />}/>

        <Route path="*" element={<Navigate to="/home" replace />}/>

      </Routes>

    ) : (
      <Landing loginRef={loginRef} />
    )}
    
    </>
  )

}

export default Home
