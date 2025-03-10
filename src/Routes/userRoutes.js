/**
 * @module userRoutes
 * @description CRUD routes for users
 * @author Shafi
 * @date 25/09/2021
 */

const express = require("express");
const { signIn, signUp } = require("../controllers/userControllers");
const userRoutes = express.Router();

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
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - username or password is missing
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/signup", signUp);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *       responses:
 *          200:
 *              description: User signed in successfully
 *          400:
 *              description: Bad request - email or password is missing
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal server error
 */
userRoutes.post("/signin", signIn);
module.exports = userRoutes;
