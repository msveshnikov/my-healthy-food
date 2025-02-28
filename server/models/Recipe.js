import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 200,
            description: 'Title of the recipe'
        },
        description: {
            type: String,
            maxLength: 500,
            description: 'Short description or summary of the recipe'
        },
        language: {
            type: String,
            default: 'en',
            description: "Language of the recipe (e.g., 'en', 'es', 'fr')"
        },
        cuisine: {
            type: String,
            description: "Type of cuisine (e.g., 'Italian', 'Mexican', 'Indian')"
        },
        dishType: {
            type: String,
            description: "Type of dish (e.g., 'Appetizer', 'Main Course', 'Dessert')"
        },
        mealType: {
            type: String,
            description: "Meal type (e.g., 'Breakfast', 'Lunch', 'Dinner', 'Snack')"
        },
        category: {
            type: String,
            description: "Category of the recipe (e.g., 'Breakfast', 'Lunch', 'Dinner', 'Dessert')"
        },
        tags: [
            {
                type: String,
                maxLength: 50,
                description: 'Keywords or tags for recipe discovery'
            }
        ],
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            pattern: '^[a-z0-9-]+$',
            description: 'SEO-friendly URL slug for the recipe'
        },
        ingredients: [
            {
                name: {
                    type: String,
                    required: true,
                    minLength: 1,
                    maxLength: 100,
                    description: 'Name of the ingredient'
                },
                quantity: {
                    type: String,
                    maxLength: 50,
                    description: "Quantity of the ingredient (e.g., '1 cup', '2 tbsp')"
                },
                unit: {
                    type: String,
                    maxLength: 20,
                    description: "Unit of measurement (e.g., 'cup', 'tbsp', 'g', 'ml')"
                },
                imageUrl: {
                    type: String,
                    format: 'url'
                },
                notes: {
                    type: String,
                    maxLength: 200,
                    description: 'Optional notes for ingredient preparation or alternatives'
                }
            }
        ],
        instructions: [
            {
                type: String,
                required: true,
                minLength: 1,
                description: 'Single step in the recipe instructions'
            }
        ],
        imageUrl: {
            type: String,
            format: 'url',
            description: 'URL of the main recipe image'
        },
        images: [
            {
                type: String,
                format: 'url',
                description: 'URLs of recipe images'
            }
        ],
        imageSource: {
            type: String,
            description: "Source of the image (e.g., 'Unsplash', 'Google Images', 'User Upload')"
        },
        videoUrl: {
            type: String,
            format: 'url',
            description: 'Optional URL of a recipe video'
        },
        aiModel: {
            type: String,
            description: 'AI model used to generate the recipe'
        },
        searchQuery: {
            type: String,
            description: 'Search query used to enhance the recipe'
        },
        searchSources: [
            {
                type: String,
                description: 'Sources used for web search'
            }
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            description: 'ID of the user who created the recipe',
            format: 'ObjectId'
        },
        likes: {
            type: Number,
            default: 0,
            min: 0,
            description: 'Number of likes for the recipe'
        },
        shares: {
            type: Number,
            default: 0,
            min: 0,
            description: 'Number of shares for the recipe'
        },
        servings: {
            type: String,
            description: 'Number of servings the recipe makes'
        },
        prepTime: {
            type: String,
            description: "Preparation time (e.g., '15 minutes')"
        },
        cookTime: {
            type: String,
            description: "Cooking time (e.g., '30 minutes')"
        },
        totalTime: {
            type: String,
            description: 'Total time (preparation + cooking time)'
        },
        calories: {
            type: String,
            description: 'Approximate calories per serving'
        },
        dietaryRestrictions: [
            {
                type: String,
                description: "Dietary restrictions (e.g., 'Vegetarian', 'Vegan', 'Gluten-Free')"
            }
        ],
        rating: {
            type: Number,
            min: 0,
            max: 5,
            description: 'User rating of the recipe (out of 5)'
        },
        notes: {
            type: String,
            description: 'Additional notes or tips for the recipe'
        },
        seoTitle: {
            type: String,
            maxLength: 70,
            description: 'SEO title for the recipe page'
        },
        seoDescription: {
            type: String,
            maxLength: 160,
            description: 'SEO description for the recipe page'
        },
        source: {
            type: String,
            default: 'ai-generated',
            description: "Source of the recipe (e.g., 'ai-generated', 'user-submitted')"
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            description: "Difficulty level of the recipe (e.g., 'Easy', 'Medium', 'Hard')"
        },
        equipment: [
            {
                type: String,
                description: "Name of kitchen equipment (e.g., 'Large skillet', 'Baking sheet')"
            }
        ],
        prepNotes: {
            type: String,
            description: 'Notes about preparation process in general'
        },
        cookNotes: {
            type: String,
            description: 'Notes about cooking process in general'
        },
        servingSuggestion: {
            type: String,
            description: 'Suggestion on how to serve the recipe'
        },
        nutritionalInformation: {
            type: {
                servingSize: {
                    type: String,
                    description:
                        "Serving size for nutritional information (e.g., 'per serving', 'per 100g')"
                },
                calories: {
                    type: String,
                    description: 'Calories per serving'
                },
                protein: {
                    type: String,
                    description: "Protein per serving (e.g., '15g')"
                },
                fat: {
                    type: String,
                    description: "Fat per serving (e.g., '10g')"
                },
                carbohydrates: {
                    type: String,
                    description: "Carbohydrates per serving (e.g., '30g')"
                },
                fiber: {
                    type: String,
                    description: "Fiber per serving (e.g., '5g')"
                },
                sugar: {
                    type: String,
                    description: "Sugar per serving (e.g., '10g')"
                },
                sodium: {
                    type: String,
                    description: "Sodium per serving (e.g., '200mg')"
                }
            },
            description: 'Detailed nutritional information per serving'
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
