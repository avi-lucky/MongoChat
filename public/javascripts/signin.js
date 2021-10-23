// SignIn User
function logIn() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    console.log(email)
    console.log(password)
    axios.post("/users/login", {
            email: email,
            password: password,
        })
        .then(function(response) {
            document.cookie = `token=${response.data.token}`
            console.log(response);
            console.log(response.data.token)
            location.replace('https://avikal-webchat-app.herokuapp.com/index')
        })
        .catch(function(error) {
            console.log(error);
        })
}

// Forgot Password
function submit() {
    const email = document.getElementById("email").value
    const newPassword = document.getElementById("newPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value
    console.log(email)
    console.log(newPassword)
    console.log(confirmPassword)
    axios.patch("/users/forgot", {
            email: email,
            password: newPassword
        })
        .then(function(response) {
            console.log(response)
            console.log(response.data)
            location.replace('https://avikal-webchat-app.herokuapp.com/')
        })
        .catch(function(error) {
            console.log(error)
        })
}