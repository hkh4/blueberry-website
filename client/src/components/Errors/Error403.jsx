import React from "react";

function Error403() {

  return (
    <div className="">
      <div className="">
        <h1>403</h1>
        <p>Forbidden! :(</p> 
        <button onClick={() => window.location.href="/home"}>Go back</button>
      </div>
    </div>
  )

}

export default Error403;
