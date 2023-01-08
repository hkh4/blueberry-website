export default function errorHandling(error) {

    // Set defaults
    let status = 500
    let message = ""
    let redirect = false

    // Check to see if the error has a response.data.error field. If so, it's an error from the server
    if (error?.response?.data?.error) {

        // Set fields
        status = error.response.data.error.status 
        message = error.response.data.error.message 
        redirect = error.response.data.error.redirect

    } else {
        // Otherwise, it's a client side issue
        status = error.status ?? status
    }

    // Put error into localstorage
    localStorage.setItem('error', message)

    // Redirect if needed
    const allErrors = [401, 403, 404, 500]
    if (redirect) {
        if (allErrors.includes(status)) {
            window.location.href = `/${status}`
        } else {
            window.location.href = "/500"
        }
    }

}