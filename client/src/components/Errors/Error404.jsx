import React from "react";

function Error404() {

  return (
    <div className="">
      <div className="">
        <h1>404</h1>
        <p>Not Found :(</p>
        <button onClick={() => window.location.href="/home"}>Go back</button>
      </div>
    </div>
  )

}

export default Error404;
