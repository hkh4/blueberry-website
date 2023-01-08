import React from "react";

function Error400() {

  return (
    <div className="">
      <div className="">
        <h1>400</h1>
        <p>Bad Request! :(</p>
        <button onClick={() => window.location.href="/home"}>Go back</button>
      </div>
    </div>
  )

}

export default Error400;
