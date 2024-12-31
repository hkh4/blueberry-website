import { useState, useEffect } from "react"

import { useAuthContext } from "../../../hooks/useAuthContext"

function Super() {

	const { user } = useAuthContext()

	// Track whether this is a super user or not
	const [superUser, setSuperUser] = useState(false) 
	const [loading, setLoading] = useState(true)

	// On first load, verify that the user is a superuser
	useEffect(() => {

		// TODO

	}, [user])

	return (
		<>
			{
				loading ? (
					<span>Loading...</span>
				) : (
					<h1>SUPER!</h1>
				)
			}
		</>
	)

}

export default Super