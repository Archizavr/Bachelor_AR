import express from 'express';
import { getUsers, getUser, postUser } from './user.controller.js';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Saņemt lietotāju sarakstu
 *     tags: 
 *       - User
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Lapošanas nobīde (sākuma pozīcija).
 *         example: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Ierobežojiet lietotāju skaitu vienā lapā.
 *         example: 5
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Lietotājvārds filtrēšanai.
 *         example: Art
 *     responses:
 *       200:
 *         description: Lietotāju saraksts un lapas informācija
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *                 pageInfo:
 *                   type: object
 *                   properties:
 *                     startCursor:
 *                       type: integer
 *                       example: 0
 *                     endCursor:
 *                       type: integer
 *                       example: 4
 *                     totalCount:
 *                       type: integer
 *                       example: 100
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 */
router.get('/', getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Iegūt lietotāju pēc ID
 *     tags: 
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID lietotāja
 *     responses:
 *       200:
 *         description: Lietotāja informācija
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       404:
 *         description: Lietotājs nav atrasts
 */
router.get('/:id', getUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Izveidot jaunu lietotāju
 *     tags: 
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewUser"
 *     responses:
 *       201:
 *         description: Lietotājs veiksmīgi izveidots
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: Nepareizi dati
 */
router.post('/', postUser);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Artemijs
 *         email:
 *           type: string
 *           example: artem@example.com
 *     NewUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Artemijs
 *         email:
 *           type: string
 *           example: artem@example.com
 *         password:
 *           type: string
 *           example: stront-password
 */
