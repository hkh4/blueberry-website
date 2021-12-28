import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import "./App.scss"

import Loading from "./components/Loading/Loading"

const Home = lazy(() => import("./components/Home/Home"))
const Error401 = lazy(() => import("./components/Errors/Error401"))
const Error403 = lazy(() => import("./components/Errors/Error403"))
const Error404 = lazy(() => import("./components/Errors/Error404"))
const Error500 = lazy(() => import("./components/Errors/Error500"))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Switch>

          <Route path="/401">
            <Error401 />
          </Route>

          <Route path="/403">
            <Error403 />
          </Route>

          <Route path="/404">
            <Error404 />
          </Route>

          <Route path="/500">
            <Error500 />
          </Route>

          <Route path="/">
            <Home />
          </Route>

        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
