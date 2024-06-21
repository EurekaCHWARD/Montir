const express = require('express');
const { requireAuthUser, requireAuthAdmin } = require('./middleware');
const {
    getAllUser,
    getUserById,
    getUserData,
    getDailyData,
    signupAdminPost,
    signupPost,
    loginAdmin,
    login,
    logout,
    addDailyData,
    editUserById,
    editUserPass,
    deleteUserById,
    getAllAudios,
} = require('./handler');

const routes = express.Router();

// User routes
routes.get('/users', requireAuthAdmin, getAllUser);
routes.post('/users', signupPost);
routes.get('/users/:id', requireAuthUser, getUserById);
routes.put('/users/:id', requireAuthUser, editUserById);
routes.put('/users/pass/:id', requireAuthUser, editUserPass);
routes.get('/user/data', requireAuthUser, getUserData);
routes.delete('/users/:id', requireAuthAdmin, deleteUserById);

// Route to add daily data
routes.post('/users/daily', requireAuthUser, addDailyData);

// Route to get daily data
routes.get('/dailydata', requireAuthUser, getDailyData);

// Admin signup route
routes.post('/admins', signupAdminPost);

// Login routes
routes.post('/login', login);
routes.post('/login_admin', loginAdmin);

// Logout route
routes.post('/logout', logout);

// Route to get all audio files
routes.get("/audios", getAllAudios);

module.exports = routes;