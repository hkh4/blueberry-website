import React, { lazy, Suspense } from "react"
import { Route, Routes } from 'react-router-dom';

import Loading from "./../Loading/Loading"
import Testing from "./../Testing/Testing"

const Document = lazy(() => import("./Document/Document"))

function Home() {

  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        <Route path="/testing" element={<Testing />} />

        <Route path="*" element={<Document />} />

      </Routes>
    </Suspense>

  )

}

export default Home
