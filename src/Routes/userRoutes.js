const express = require("express");
const userRoutes = express.Router();
const { signUp, signIn } = require("../controllers/userControllers");

/**
 * @swagger
 * tags:
 *   - name: Users
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 *       400:
 *         description: Bad request - email or password is missing
 *       401:
 *         description: Unauthorized - Invalid token
 *     security:
 *       - BearerAuth: []
 */
userRoutes.post("/signup", signUp);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Sign in a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Bad request - email or password is missing
 *       401:
 *         description: Unauthorized - Invalid token
 *     security:
 *       - BearerAuth: []
 */
userRoutes.post("/signin", signIn);

module.exports = userRoutes;
