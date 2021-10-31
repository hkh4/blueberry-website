import React, { useEffect, lazy, Suspense } from "react"
import { Route, Switch, Redirect } from 'react-router-dom';

import Loading from "./../Loading/Loading"

const Editor = lazy(() => import("./Editor/Editor"))

function Home() {

  return (
    <Suspense fallback={<Loading />}>
      <Switch>

        <Route path="/">
          <Editor />
        </Route>

      </Switch>
    </Suspense>

  )

}

export default Home
