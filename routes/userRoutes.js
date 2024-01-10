const {registerUser,loginUser,searchUsers} = require('../controllers/userController')
const {verifyToken} = require('../middleware/authmiddleware')

const userRoutes = (app) => {
    app.route("/api/users/register").post(registerUser);
    app.route("/api/users/login").post(loginUser)
    app.route('/api/users').get(verifyToken,searchUsers)
}

module.exports = {userRoutes};