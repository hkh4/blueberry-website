import { useEffect } from "react";
import { useLogout } from "./../../hooks/useLogout";

function Error401() {

  const { logout } = useLogout()

  // For this error route only: since we're in an "unauthorized" error, log the user out immediately
  useEffect(() => {
    logout()
  }, [])

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
