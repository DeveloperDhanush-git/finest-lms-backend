const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const newUser = await authService.registerUser(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshUserToken(refreshToken);

        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await authService.logoutUser(refreshToken);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        await authService.forgotPassword(
            req.body.email
        );
        return res.status(200).json({
            success: true,
            message:
                "If the email exists, a password reset link has been sent.",
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        await authService.resetPassword(
            req.params.token,
            req.body.password
        );

        return res.status(200).json({
            success: true,
            message:
                "Password reset successful",
        });

    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user,
    });
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    getCurrentUser,
};