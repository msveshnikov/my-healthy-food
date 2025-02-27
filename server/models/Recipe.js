import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 200
        },
        description: {
            type: String,
            maxLength: 500
        },
        language: {
            type: String,
            default: 'en'
        },
        cuisine: {
            type: String
        },
        category: {
            type: String,
            description: "Category of the recipe (e.g., 'Breakfast', 'Lunch', 'Dinner', 'Dessert')"
        },
        tags: [
            {
                type: String,
                maxLength: 50
            }
        ],
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            pattern: '^[a-z0-9-]+$'
        },
        ingredients: [
            {
                name: {
                    type: String,
                    required: true,
                    minLength: 1,
                    maxLength: 100
                },
                quantity: {
                    type: String,
                    maxLength: 50
                },
                unit: {
                    type: String,
                    maxLength: 20
                }
            }
        ],
        instructions: [
            {
                type: String,
                required: true,
                minLength: 1
            }
        ],
        imageUrl: {
            type: String,
            format: 'url'
        },
        imageSource: {
            type: String
        },
        videoUrl: {
            type: String,
            format: 'url'
        },
        aiModel: {
            type: String,
            enum: [
                'gpt-4o-mini',
                'gemini-2.0-flash-thinking-exp-01-21',
                'deepseek-reasoner',
                'claude-3-7-sonnet-20250219',
                'grok-2-latest'
            ]
        },
        searchQuery: {
            type: String
        },
        searchSources: [
            {
                type: String
            }
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likes: {
            type: Number,
            default: 0,
            min: 0
        },
        shares: {
            type: Number,
            default: 0,
            min: 0
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
