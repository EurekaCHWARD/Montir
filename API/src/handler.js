const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./database');
require('dotenv').config();

// Maximum token expiration time (3 days)
const maxExpire = 3 * 24 * 60 * 60;

// Function to create a user token
const createToken = (id) => jwt.sign({ id }, process.env.SECRET_STRING, { expiresIn: maxExpire });

// Function to create an admin token
const createTokenAdmin = (id) => jwt.sign({ id }, process.env.SECRET_STRING_ADMIN, { expiresIn: maxExpire });

// Function to calculate BMI
const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100; // Convert height from cm to meters
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
};

// Function to get all users
exports.getAllUser = async(req, res) => {
    const [result] = await db.promise().query('SELECT * FROM users');
    res.send(result);
};

// Function to register a new user
exports.signupPost = async(req, res) => {
    const { email, username, password, age, gender, city, height, weight } = req.body;
    const { nanoid } = await
    import ('nanoid');
    const id = nanoid(16);

    // Validate inputs
    if (!email || !username || !password || !age || !city || !height || !weight) {
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
    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Email harus berakhiran dengan @gmail.com!',
        });
    }

    // Check for existing email and username
    const [userEmailCheck] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (userEmailCheck.length !== 0) {
        return res.status(500).json({ message: 'Email tersebut sudah digunakan!' });
    }
    const [userCheck] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (userCheck.length !== 0) {
        return res.status(500).json({ message: 'Username tersebut sudah digunakan!' });
    }

    // Hash password and calculate BMI
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const bmi = calculateBMI(height, weight);

    // Insert user and related data
    await db.promise().query('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, email, username, hashedPassword, age, city, gender, height, weight, bmi]);
    //await db.promise().query('INSERT INTO datas (user_id, age, gender, city, bmi) VALUES (?, ?, ?, ?, ?)', [id, age, gender, city, bmi]);

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
    const [rows] = await db.promise().query('SELECT age, city, gender, bmi FROM users WHERE id = ? ORDER BY id DESC LIMIT 1', [userId]);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Data pengguna tidak ditemukan.' });
    }

    const { age, city, gender, bmi } = rows[0];

    await db.promise().query(
        'INSERT INTO datas (user_id, age, city, gender, bmi, stress_level, sleep_duration) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, age, city, gender, bmi, stress_level, sleep_duration]
    );

    return res.status(201).json({
        message: 'Data harian berhasil ditambahkan.',
        data: { userId, age, city, gender, bmi, stress_level, sleep_duration }
    });
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
    const { email, username, password } = req.body;
    const { nanoid } = await
    import ('nanoid');
    const id = nanoid(16);

    // Validate inputs
    if (!email || !username || !password) {
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
    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({
            status: 'Gagal',
            message: 'Email harus berakhiran dengan @gmail.com!',
        });
    }

    // Check for existing email and username
    const [adminEmailCheck] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
    if (adminEmailCheck.length !== 0) {
        return res.status(500).json({ message: 'Email tersebut sudah digunakan!' });
    }
    const [adminCheck] = await db.promise().query('SELECT * FROM admins WHERE username = ?', [username]);
    if (adminCheck.length !== 0) {
        return res.status(500).json({ message: 'Username tersebut sudah digunakan!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin
    await db.promise().query('INSERT INTO admins VALUES (?, ?, ?, ?)', [id, email, username, hashedPassword]);

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
    const { email, username, password, age, city, gender, height, weight } = req.body;
    const userId = req.params.id;
    const bmi = calculateBMI(height, weight);

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
        'UPDATE users SET email = ?, username = ?, password = ?, age = ?, city = ?, gender = ?, height = ?, weight = ?, bmi = ? WHERE id = ?', [email, username, hashedPassword, age, city, gender, height, weight, bmi, userId]
    );

    // Update user's data in the datas table
    await db.promise().query(
        'UPDATE datas SET age = ?, gender = ?, city = ?, bmi = ? WHERE user_id = ?', [age, gender, city, bmi, userId]
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
            res.cookie('jwt', token, { httpOnly: false, maxAge: maxExpire * 1000 });
            return res.status(200).json({
                message: 'Login berhasil!',
                user_id: rows[0].id,
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
            res.cookie('jwt', token, { httpOnly: false, maxAge: maxExpire * 1000 });
            return res.status(200).json({
                message: 'Login sebagai admin!',
                user_id: rows[0].id,
            });
        }
        return res.status(404).json({ message: 'Password salah!' });
    }
    return res.status(404).json({ message: 'Username tidak ditemukan!' });
};

// Function to logout
exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.status(200).json({ message: 'Logout sukses!' });
};