const express = require("express");
const router = express.Router();

const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipe.controller");

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: რეცეპტების მართვა
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: ფქვილი
 *         quantity:
 *           type: string
 *           example: 500გ
 *
 *     Step:
 *       type: object
 *       properties:
 *         stepNumber:
 *           type: number
 *           example: 1
 *         instruction:
 *           type: string
 *           example: ცომის მომზადება
 *
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f123abc123
 *         title:
 *           type: string
 *           example: ხაჭაპური
 *         description:
 *           type: string
 *           example: გემრიელი ქართული კერძი
 *         image:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         author:
 *           type: string
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ingredient'
 *         steps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Step'
 *         cookTime:
 *           type: number
 *           example: 40
 *         servings:
 *           type: number
 *           example: 4
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *         category:
 *           type: string
 *           example: Main Course
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         likes:
 *           type: number
 *           example: 10
 *         isPublished:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: ყველა რეცეპტის მიღება (pagination + filter)
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: რეცეპტების სია
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 */
router.get("/", getAllRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: ერთი რეცეპტის მიღება
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ერთი რეცეპტი
 *       404:
 *         description: ვერ მოიძებნა
 */
router.get("/:id", getRecipeById);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: ახალი რეცეპტის შექმნა
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: წარმატებით შეიქმნა
 *       400:
 *         description: არასწორი მონაცემები
 */
router.post("/", createRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: სრული განახლება
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: განახლდა
 */
router.put("/:id", updateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   patch:
 *     summary: ნაწილობრივი განახლება
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 */
router.patch("/:id", updateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: რეცეპტის წაშლა
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: წაიშალა
 *       404:
 *         description: ვერ მოიძებნა
 */
router.delete("/:id", deleteRecipe);

module.exports = router;
