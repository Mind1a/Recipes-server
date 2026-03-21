const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    // 🧾 ძირითადი ინფორმაცია
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    // 🖼️ სურათები
    image: {
      type: String, // მთავარი სურათი
    },
    images: [
      {
        type: String, // დამატებითი სურათები
      },
    ],

    // 🧑‍🍳 ავტორი
    author: {
      type: String, // ან ObjectId (თუ Users დაამატებ მომავალში)
    },

    // 🧂 ინგრედიენტები
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String }, // "2 cups", "1 tbsp"
      },
    ],

    // 📋 მომზადების ნაბიჯები
    steps: [
      {
        stepNumber: Number,
        instruction: String,
      },
    ],
    cookTime: {
      type: Number, // ხარშვის/ცხობის დრო
    },
    // 🍽️ პორციები და სირთულე
    servings: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    // 🏷️ კატეგორიები და ტეგები
    category: {
      type: String, // "Dessert", "Main Course"
    },
    tags: [
      {
        type: String, // "vegan", "quick", "healthy"
      },
    ],

    // ❤️ ფავორიტები
    likes: {
      type: Number,
      default: 0,
    },

    // 🔒 სტატუსი
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

module.exports = mongoose.model("Recipe", recipeSchema);
