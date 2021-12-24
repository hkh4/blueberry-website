import React, { useEffect, lazy, Suspense } from "react"
import { Route, Switch, Redirect } from 'react-router-dom';

import Loading from "./../Loading/Loading"

const Document = lazy(() => import("./Document/Document"))

function Home() {

  return (
    <Suspense fallback={<Loading />}>
      <Switch>

        <Route path="/">
          <Document />
        </Route>

      </Switch>
    </Suspense>

  )

}

export default Home
