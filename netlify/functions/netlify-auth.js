exports.handler = async (event, context) => {

    console.log(context.clientContext.user)

    if (context.clientContext.user) {

        const user = { email: context.clientContext.user.email, isAuthenticated: true };

        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }

    } 

    return {
        statusCode: 401,
        body: JSON.stringify({ msg: "You must be logged in.", isAuthenticated: false })
    }

}

// Force the user to log in before they check out
// Calculate the total price on the server
// Prepopulate the form if the user has order before when they log in
// Force all request to come from netlify to the backend for orders