const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user))
}

const logOut = () => {
    localStorage.removeItem("user")
}

const getCredentials = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    return user;
}

export {login, logOut, getCredentials}