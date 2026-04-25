const Recipe = require("../models/Recipe");
const {
  uploadBase64Image,
  uploadImagesArray,
} = require("../config/cloudinary.upload");

exports.getAllRecipes = async (req, res) => {
  try {
    // 📌 Query params
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;

    // 🧮 Pagination values
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 🎯 Filter
    const filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // 📊 Total count
    const totalRecipes = await Recipe.countDocuments(filter);

    // 📄 Data fetch
    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // 📐 Total pages
    const totalPages = Math.ceil(totalRecipes / limitNumber);

    res.status(200).json({
      success: true,

      // 📊 Pagination info
      pagination: {
        totalItems: totalRecipes,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },

      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipes",
      error: error.message,
    });
  }
};

//
// 📌 GET SINGLE RECIPE BY ID
//
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipe",
      error: error.message,
    });
  }
};

//
// 📌 CREATE NEW RECIPE
//
exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      images,
      author,
      ingredients,
      steps,
      cookTime,
      servings,
      difficulty,
      category,
      tags,
    } = req.body;

    // 🛑 Basic validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const imageUrl = image ? await uploadBase64Image(image) : undefined;
    const imagesUrls = await uploadImagesArray(images);

    // 🧠 Create recipe
    const newRecipe = await Recipe.create({
      title,
      description,
      image: imageUrl || image,
      images: imagesUrls?.length ? imagesUrls : images,
      author,
      ingredients,
      steps,
      cookTime,
      servings,
      difficulty,
      category,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: newRecipe,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create recipe",
      error: error.message,
    });
  }
};

//
// 📌 DELETE RECIPE
//
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete recipe",
      error: error.message,
    });
  }
};

//
// 📌 UPDATE RECIPE
//
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image,
      images,
      author,
      ingredients,
      steps,
      cookTime,
      servings,
      difficulty,
      category,
      tags,
    } = req.body;

    // 🛑 მინიმალური validation
    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (description !== undefined && description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Description cannot be empty",
      });
    }

    const imageUrl = image ? await uploadBase64Image(image) : undefined;
    const imagesUrls = images ? await uploadImagesArray(images) : undefined;

    // 🧠 Update object (whitelisting)
    const updateData = {
      title,
      description,
      image: imageUrl || image,
      images: imagesUrls?.length ? imagesUrls : images,
      author,
      ingredients,
      steps,
      cookTime,
      servings,
      difficulty,
      category,
      tags,
    };

    // remove undefined fields (clean update)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
      new: true, // დაბრუნდეს განახლებული მონაცემი
      runValidators: true, // mongoose validation
    });

    if (!updatedRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: updatedRecipe,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update recipe",
      error: error.message,
    });
  }
};
