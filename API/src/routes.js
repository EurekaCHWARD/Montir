const express = require('express');
const { requireAuthUser, requireAuthAdmin } = require('./middleware');
const {
    getAllUser,
    signupPost,
    addDailyData,
    signupAdminPost,
    getUserById,
    editUserById,
    deleteUserById,
    login,
    logout,
    loginAdmin,
    getUserData,
} = require('./handler');

const routes = express.Router();

// User routes
routes.get('/users', requireAuthAdmin, getAllUser);
routes.post('/users', signupPost);
routes.get('/users/:id', requireAuthUser, getUserById);
routes.put('/users/:id', requireAuthUser, editUserById);
routes.delete('/users/:id', requireAuthAdmin, deleteUserById);
routes.get('/user/data', requireAuthUser, getUserData);

// Route to add daily data
routes.post('/users/daily', requireAuthUser, addDailyData);

// Admin signup route
routes.post('/admins', signupAdminPost);

// Login routes
routes.post('/login', login);
routes.post('/login_admin', loginAdmin);

// Logout route
routes.post('/logout', logout);

module.exports = routes;