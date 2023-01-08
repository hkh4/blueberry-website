import { lazy, Suspense } from "react"
import { 
  BrowserRouter as Router, 
  Route, 
  Routes,
  Link
} from 'react-router-dom';

const Document = lazy(() => import("./Document/Document"))
const Landing = lazy(() => import("./Landing/Landing"))

function Home() {

  return (

    <>

    <div className="header">

      <Link to="/">Home</Link>

    </div>

    <Routes>

      <Route path="/documents/:id" element={<Document />}/>

      <Route path="*" element={<Landing />}/>

    </Routes>

    </>

    )

}

export default Home
