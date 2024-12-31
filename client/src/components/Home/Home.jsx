import { lazy } from "react"
import { 
  BrowserRouter as Router,  
  Route, 
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuthContext } from "./../../hooks/useAuthContext"

const Document = lazy(() => import("./Document/Document"))
const Landing = lazy(() => import("./Landing/Landing"))
const Welcome = lazy(() => import("./Welcome/Welcome"))
const Super = lazy(() => import("./Super/Super"))

function Home() {

  const { user } = useAuthContext()

  return (
    <>

    {user ? (

      <Routes>

        <Route path="/documents/:id" element={<Document />}/>

        <Route path="/home" element={<Landing />}/>

        <Route path="/super" element={<Super />}/>

        <Route path="*" element={<Navigate to="/home" replace />}/>

      </Routes>

    ) : (
      <Welcome />
    )}
    
    </>
  )

}

export default Home
