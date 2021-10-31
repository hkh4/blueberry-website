import React from "react";

function Error500() {

  return (
    <div className="">
      <div className="">
        <h1>500</h1>
        <p>Error :(</p>
        <button onClick={() => window.location.href="/home"}>Go back</button>
      </div>
    </div>
  )

}

export default Error500;
