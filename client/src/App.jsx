import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom" 
import { DocumentsContextProvider } from "./contexts/DocumentsContext"

import "./App.scss"

import Loading from "./components/Loading/Loading"

const Home = lazy(() => import("./components/Home/Home"))
const Testing = lazy(() => import("./components/Testing/Testing")) 
const Error400 = lazy(() => import("./components/Errors/Error400"))
const Error401 = lazy(() => import("./components/Errors/Error401"))
const Error403 = lazy(() => import("./components/Errors/Error403"))
const Error404 = lazy(() => import("./components/Errors/Error404"))
const Error500 = lazy(() => import("./components/Errors/Error500"))

function App() {
  return (
    <DocumentsContextProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>

            <Route path="/400" element={<Error400 />} />

            <Route path="/401" element={<Error401 />} />

            <Route path="/403" element={<Error403 />} />

            <Route path="/404" element={<Error404 />} />

            <Route path="/500" element={<Error500 />} />   

            <Route path="/testing" element={<Testing />}/>
  
            
              <Route path="*" element={<Home />} />
            

          </Routes>
        </Suspense>
      </Router>
    </DocumentsContextProvider>
  );
}

export default App;
