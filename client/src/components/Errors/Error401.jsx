import React from "react";

function Error401() {

  return (
    <div className="">
      <div className="">
        <h1>401</h1>
        <p>Unauthorized! :(</p>
        <button onClick={() => window.location.href="/home"}>Go back</button>
      </div>
    </div>
  )

}

export default Error401;
