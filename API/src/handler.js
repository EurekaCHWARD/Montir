const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./database');
require('dotenv').config();
const axios = require("axios");

// Maximum token expiration time (3 days)
const maxExpire = 3 * 24 * 60 * 60;

// Function to create a user token
const createToken = (id) => jwt.sign({ id }, process.env.SECRET_STRING, { expiresIn: maxExpire });

// Function to create an admin token
const createTokenAdmin = (id) => jwt.sign({ id }, process.env.SECRET_STRING_ADMIN, { expiresIn: maxExpire });

const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100; // Convert height from cm to meters
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    // Define BMI thresholds
    const BMI_Underweight = 18.5;
    const BMI_Normal = 24.9;
    const BMI_Overweight = 29.9;
    const BMI_Obese = 100; // Set a high value, assuming obesity starts at BMI 30

    // Determine BMI category
    let underweight = false,
        normal = false,
        overweight = false,
        obese = false;
    if (bmi < BMI_Underweight) {
        underweight = true;
    } else if (bmi <= BMI_Normal) {
        normal = true;
    } else if (bmi <= BMI_Overweight) {
        overweight = true;
    } else {
        bmi <= BMI_Obese
        obese = true;
    }

    return {
        bmi: bmi,
        bmi_underweight: underweight,
        bmi_normal: normal,
        bmi_overweight: overweight,
        bmi_obese: obese
    };
};


// Function to get all users
exports.getAllUser = async(req, res) => {
    const [result] = await db.promise().query('SELECT * FROM users');
    res.send(result);
};

// Function to register a new user
exports.signupPost = async(req, res) => {
    const { username, password, age, gender, city, height, weight } = req.body;
    const { nanoid } = await
    import ('nanoid');
    const id = nanoid(16);

    // Validate inputs
    if (!username || !password || !age || !city || !height || !weight) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal menambah user baru, semua field diperlukan!',
        });
    }
    if (username.length < 6 || password.length < 6) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Panjang username dan/atau password harus 6 karakter atau lebih!',
        });
    }

    // Check for existing username
    const [userCheck] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (userCheck.length !== 0) {
        return res.status(500).json({ message: 'Username tersebut sudah digunakan!' });
    }

    // Hash password and calculate BMI
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const bmiData = calculateBMI(height, weight);

    // Insert user and related data
    await db.promise().query('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, username, hashedPassword, age, city, gender, height, weight, bmiData.bmi, bmiData.bmi_underweight, bmiData.bmi_normal, bmiData.bmi_overweight, bmiData.bmi_obese]);

    return res.status(201).json({
        status: 'Sukses',
        message: 'User baru berhasil ditambahkan.',
        data: { userId: id },
    });
};

// Function to add daily user data
exports.addDailyData = async(req, res) => {
    const { stress_level, sleep_duration } = req.body;
    const userId = req.user.id;

    if (stress_level === undefined || sleep_duration === undefined) {
        return res.status(400).json({ message: 'Semua field harus diisi.' });
    }

    // Retrieve the user's existing users from the datas table
    const [rows] = await db.promise().query('SELECT age, city, gender, bmi, bmi_underweight, bmi_normal, bmi_overweight, bmi_obese FROM users WHERE id = ? ORDER BY id DESC LIMIT 1', [userId]);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Data pengguna tidak ditemukan.' });
    }

    const { age, city, gender, bmi, bmi_underweight, bmi_normal, bmi_overweight, bmi_obese } = rows[0];

    // Prepare data for the model prediction
    const predictionData = {
        age: age,
        gender: gender,
        stress_level: stress_level,
        sleep_duration: sleep_duration,
        bmi_underweight: bmi_underweight ? 1 : 0,
        bmi_normal: bmi_normal ? 1 : 0,
        bmi_overweight: bmi_overweight ? 1 : 0,
        bmi_obese: bmi_obese ? 1 : 0
    };

    // Make sure all fields are present and valid
    const requiredFields = ['age', 'gender', 'stress_level', 'sleep_duration', 'bmi_underweight', 'bmi_normal', 'bmi_overweight', 'bmi_obese'];
    for (const field of requiredFields) {
        if (predictionData[field] === undefined || predictionData[field] === null) {
            return res.status(400).json({ message: `Field '${field}' is missing or invalid.` });
        }
    }

    try {
        // Call the Flask endpoint to get the quality score
        const response = await axios.post(
            "http://127.0.0.1:5000/predict",
            predictionData
        );
        const quality_score = response.data.quality_score;

        // Update the datas table with the quality score
        await db
            .promise()
            .query(
                "INSERT INTO datas (user_id, age, city, gender, bmi, stress_level, sleep_duration, quality_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [userId, age, city, gender, bmi, stress_level, sleep_duration, quality_score]
            );

        return res.status(201).json({
            message: "Data harian berhasil ditambahkan.",
            data: {
                userId,
                age,
                city,
                gender,
                bmi,
                stress_level,
                sleep_duration,
                quality_score,
            },
        });
    } catch (error) {
        console.error(
            "Error fetching quality score:",
            error.response ? error.response.data : error.message
        );
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Function to get daily data
exports.getDailyData = async(req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    try {
        // Retrieve data from the database based on the date range
        const [rows] = await db.promise().query('SELECT * FROM datas WHERE date BETWEEN ? AND ?', [startDate, endDate]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No data found for the specified date range.' });
        }

        // Return the data in the response
        return res.status(200).json({ message: 'Data retrieved successfully.', data: rows });
    } catch (error) {
        console.error('Error fetching daily data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Function to get user's datas
exports.getUserData = async(req, res) => {
    const userId = req.user.id; // Get user ID from the authenticated request
    try {
        // Retrieve user's data from the database
        const [userData] = await db.promise().query('SELECT * FROM datas WHERE user_id = ?', [userId]);

        if (userData.length === 0) {
            return res.status(404).json({ message: 'User data not found.' });
        }

        // Return the user's data in the response
        return res.status(200).json({ message: 'User data retrieved successfully.', data: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Function to register a new admin
exports.signupAdminPost = async(req, res) => {
    const { username, password } = req.body;
    const { nanoid } = await
    import ('nanoid');
    const id = nanoid(16);

    // Validate inputs
    if (!username || !password) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal menambah admin baru, semua field diperlukan!',
        });
    }
    if (username.length < 6 || password.length < 6) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Panjang username dan/atau password harus 6 karakter atau lebih!',
        });
    }

    // Check for existing username
    const [adminCheck] = await db.promise().query('SELECT * FROM admins WHERE username = ?', [username]);
    if (adminCheck.length !== 0) {
        return res.status(500).json({ message: 'Username tersebut sudah digunakan!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin
    await db.promise().query('INSERT INTO admins VALUES (?, ?, ?)', [id, username, hashedPassword]);

    return res.status(201).json({
        status: 'Sukses',
        message: 'Admin baru berhasil ditambahkan.',
        data: { adminId: id },
    });
};

// Function to get a user by ID
exports.getUserById = async(req, res) => {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: 'User dengan id tersebut tidak dapat ditemukan!' });
    }
    return res.status(200).json({ message: 'data found', data: rows[0] });
};

// Function to edit user's data by ID
exports.editUserById = async(req, res) => {
    const { username, password, age, city, gender, height, weight } = req.body;
    const userId = req.params.id;
    const bmiData = calculateBMI(height, weight);

    // Validate inputs
    if (!username || !password) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal mengedit informasi user, username dan/atau password diperlukan!',
        });
    }
    if (username.length < 6 || password.length < 6) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Panjang username dan/atau password harus 6 karakter atau lebih!',
        });
    }
    if (!age) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal mengedit informasi user, age diperlukan!',
        });
    }

    // Check if user exists
    const [userRows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
        return res.status(404).json({ message: 'User dengan id tersebut tidak dapat ditemukan!' });
    }

    // Check if username is already in use by another user
    const [check] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (check.length !== 0 && check[0].id !== userId) {
        return res.status(500).json({ message: 'Username tersebut sudah digunakan!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's information in the users table
    await db.promise().query(
        'UPDATE users SET username = ?, password = ?, age = ?, city = ?, gender = ?, height = ?, weight = ?, bmi = ?, bmi_underweight = ?, bmi_normal = ?, bmi_overweight = ?, bmi_obese = ? WHERE id = ?', [username, hashedPassword, age, city, gender, height, weight, bmiData.bmi, bmiData.bmi_underweight, bmiData.bmi_normal, bmiData.bmi_overweight, bmiData.bmi_obese, userId]
    );

    // Update user's data in the datas table
    await db.promise().query(
        'UPDATE datas SET age = ?, gender = ?, city = ?, bmi = ?  WHERE user_id = ?', [age, gender, city, bmiData.bmi, userId]
    );

    return res.status(200).json({ message: 'Update data sukses!', id: userId });
};

// Function to delete a user by ID
exports.deleteUserById = async(req, res) => {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: 'User dengan id tersebut tidak ditemukan.' });
    }

    // Delete related data from the datas table
    await db.promise().query('DELETE FROM datas WHERE user_id = ?', [req.params.id]);

    // Delete the user from the users table
    await db.promise().query('DELETE FROM users WHERE id = ?', [req.params.id]);
    return res.status(200).json({ message: 'User dengan data di bawah ini sukses dihapus dari database!', data: rows });
};

// Function to login as a user
exports.login = async(req, res) => {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal login, username dan/atau password diperlukan!',
        });
    }
    if (username.length < 6 || password.length < 6) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Panjang username dan/atau password harus 6 karakter atau lebih!',
        });
    }

    // Check if user exists and password is correct
    const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length !== 0) {
        const auth = await bcrypt.compare(password, rows[0].password);
        if (auth) {
            const token = createToken(rows[0].id);
            return res.status(200).json({
                message: 'Login berhasil!',
                user_id: rows[0].id,
                token: token,
            });
        }
        return res.status(404).json({ message: 'Password salah!' });
    }
    return res.status(404).json({ message: 'Username tidak ditemukan!' });
};

// Function to login as an admin
exports.loginAdmin = async(req, res) => {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Gagal login, username dan/atau password diperlukan!',
        });
    }
    if (username.length < 6 || password.length < 6) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Panjang username dan/atau password harus 6 karakter atau lebih!',
        });
    }

    // Check if admin exists and password is correct
    const [rows] = await db.promise().query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length !== 0) {
        const auth = await bcrypt.compare(password, rows[0].password);
        if (auth) {
            const token = createTokenAdmin(rows[0].id);
            return res.status(200).json({
                message: 'Login sebagai admin!',
                user_id: rows[0].id,
                token: token,
            });
        }
        return res.status(404).json({ message: 'Password salah!' });
    }
    return res.status(404).json({ message: 'Username tidak ditemukan!' });
};

// Function to logout
exports.logout = (req, res) => {
    return res.status(200).json({ message: 'Logout sukses!' });
};