import React, { lazy, Suspense } from "react"
import { Route, Switch } from 'react-router-dom';

import Loading from "./../Loading/Loading"
import Testing from "./../Testing/Testing"

const Document = lazy(() => import("./Document/Document"))

function Home() {

  return (
    <Suspense fallback={<Loading />}>
      <Switch>

        <Route path="/testing">
          <Testing />
        </Route>

        <Route path="/">
          <Document />
        </Route>

      </Switch>
    </Suspense>

  )

}

export default Home
