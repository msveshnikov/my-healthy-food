import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        ingredients: [
            {
                type: String
            }
        ],
        instructions: [
            {
                type: String
            }
        ],
        language: {
            type: String,
            default: 'en'
        },
        source: {
            type: String,
            default: 'ai-generated'
        },
        images: [
            {
                type: String
            }
        ],
        tags: [
            {
                type: String
            }
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        },
        model: {
            type: String
        },
        servings: {
            type: String
        },
        prepTime: {
            type: String
        },
        cookTime: {
            type: String
        },
        totalTime: {
            type: String
        },
        calories: {
            type: String
        },
        cuisine: {
            type: String
        },
        dishType: {
            type: String
        },
        mealType: {
            type: String
        },
        dietaryRestrictions: [
            {
                type: String
            }
        ],
        rating: {
            type: Number,
            min: 0,
            max: 5
        },
        notes: {
            type: String
        },
        seoTitle: {
            type: String
        },
        seoDescription: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
