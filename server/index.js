import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getTextGemini } from './gemini.js';
import Recipe from './models/Recipe.js';
import Feedback from './models/Feedback.js';
import { replaceRecipeImages } from './imageService.js';
import userRoutes from './user.js';
import adminRoutes from './admin.js';
import { authenticateToken, isAdmin } from './middleware/auth.js';
import { fetchSearchResults, searchWebContent } from './search.js';
import { enrichRecipeMetadata, generateUniqueSlug } from './utils.js';
import { getTextGpt } from './openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://MyHealthy.Food' : '*'
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(join(__dirname, '../dist')));
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 130
});

if (process.env.NODE_ENV === 'production') {
    app.use('/api/', limiter);
}

mongoose.connect(process.env.MONGODB_URI, {});

userRoutes(app);
adminRoutes(app);

const generateAIResponse = async (prompt, model, temperature = 0.7) => {
    switch (model) {
        case 'o3-mini':
        case 'gpt-4o-mini': {
            return await getTextGpt(prompt, model, temperature);
        }
        case 'gemini-2.0-pro-exp-02-05':
        case 'gemini-2.0-flash-001':
        case 'gemini-2.0-flash-thinking-exp-01-21':
            return await getTextGemini(prompt, model, temperature);
        default:
            throw new Error('Invalid model specified');
    }
};

const extractCodeSnippet = (text) => {
    const codeBlockRegex = /```(?:json|js|html)?\n([\s\S]*?)\n```/;
    const match = text.match(codeBlockRegex);
    return match ? match[1] : text;
};

const generateRecipeObject = async (
    prompt,
    language,
    model,
    temperature,
    deepResearch,
    imageSource,
    userId
) => {
    const exampleSchema = fs.readFileSync(join(__dirname, 'recipeSchema.json'), 'utf8');
    const webSearchContent = await fetchSearchResults(prompt);
    let webContent = '';
    if (deepResearch) {
        webContent = await searchWebContent(webSearchContent);
    }

    let aiPrompt = `Generate a recipe based on the following prompt: "${prompt}".
Generate recipe in "${language}" language.
Research the web and think about the topic before generating if web search results are provided.
<web_search_results>${JSON.stringify(webSearchContent)}</web_search_results>
<web_content>${webContent}</web_content>
Format the result as a JSON object representing the recipe based on schema.
Use the following example schema as a reference for recipe structure:
${exampleSchema}`;

    let parsed;
    try {
        const result = await generateAIResponse(aiPrompt, model, temperature);
        parsed = JSON.parse(extractCodeSnippet(result));
    } catch (e) {
        console.error('AI response parsing error:', e);
        throw new Error('Failed to parse AI response');
    }

    parsed = await replaceRecipeImages(parsed, imageSource);

    const recipe = new Recipe({
        title: parsed.title || prompt,
        description: parsed.description,
        seoTitle: parsed.seoTitle,
        seoDescription: parsed.seoDescription,
        language,
        recipeData: parsed,
        slug: await generateUniqueSlug(parsed.title || prompt, language),
        userId: userId,
        cuisine: parsed.cuisine,
        category: parsed.category,
        tags: parsed.tags,
        imageUrl: parsed.imageUrl,
        imageSource: imageSource,
        videoUrl: parsed.videoUrl,
        aiModel: model,
        searchQuery: parsed.searchQuery,
        searchSources: parsed.searchSources,
        ingredients: parsed.ingredients,
        instructions: parsed.instructions
    });
    return recipe;
};

const generateRecipeTitles = async (cuisine, language, model, count) => {
    const aiPrompt = `Generate ${count} recipe titles for ${cuisine} cuisine in ${language} language. Return as array of strings.`;
    try {
        const result = await generateAIResponse(aiPrompt, model);
        const titles = JSON.parse(extractCodeSnippet(result));
        if (!Array.isArray(titles)) {
            throw new Error('AI response did not return an array of titles.');
        }
        return titles;
    } catch (e) {
        console.error('AI title generation error:', e);
        throw new Error('Failed to generate recipe titles.');
    }
};

app.post('/api/generate-recipe', authenticateToken, isAdmin, async (req, res) => {
    try {
        let { prompt, language, model, temperature, deepResearch, imageSource } = req.body;
        console.log(prompt, language, model, temperature, deepResearch, imageSource);
        prompt = prompt?.substring(0, 100);
        language = language || 'en';
        model = model || 'gemini-2.0-flash-thinking-exp-01-21';
        temperature = temperature || 0.7;
        imageSource = imageSource || 'unsplash';

        const recipe = await generateRecipeObject(
            prompt,
            language,
            model,
            temperature,
            deepResearch,
            imageSource,
            req?.user?.id
        );
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-recipe-titles', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { cuisine, model, count } = req.body;
        if (!cuisine || !model || !count || count > 50) {
            return res
                .status(400)
                .json({ error: 'Invalid request parameters for title generation.' });
        }

        const titles = await generateRecipeTitles(cuisine, 'en', model, count);
        res.status(200).json({ titles });
    } catch (error) {
        console.error('Recipe titles generation error:', error);
        res.status(500).json({ error: 'Failed to generate recipe titles.' });
    }
});

app.post('/api/recipes/:recipeId/rate', authenticateToken, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { rating } = req.body;

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
        }
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ error: 'Invalid recipe ID.' });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }

        recipe.ratingCount = (recipe.ratingCount || 0) + 1;
        recipe.ratingValue = (recipe.ratingValue || 0) + rating;
        recipe.averageRating = recipe.ratingValue / recipe.ratingCount;

        await recipe.save();

        res.status(200).json({
            message: 'Rating submitted successfully.',
            averageRating: recipe.averageRating
        });
    } catch (error) {
        console.error('Recipe rating error:', error);
        res.status(500).json({ error: 'Failed to rate recipe.' });
    }
});

app.get('/api/recipes', async (req, res) => {
    try {
        const search = req.query.search;
        let filter = { isPrivate: { $ne: true } };
        if (search) {
            filter = {
                $and: [
                    filter,
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }
        const recipes = await Recipe.find(filter).sort({ createdAt: -1 }).limit(300);
        const limitedRecipes = recipes.map((recipe) => ({
            _id: recipe._id,
            title: recipe.title,
            description: recipe.description,
            model: recipe.model,
            slug: recipe.slug,
            imageUrl: recipe.imageUrl,
            averageRating: recipe.averageRating
        }));
        res.status(200).json(limitedRecipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/myrecipes', authenticateToken, async (req, res) => {
    try {
        const search = req.query.search;
        let query = { userId: req.user.id };
        if (search) {
            query = {
                $and: [
                    query,
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }
        const recipes = await Recipe.find(query);
        const limitedRecipes = recipes.map((recipe) => ({
            _id: recipe._id,
            title: recipe.title,
            description: recipe.description,
            model: recipe.model,
            slug: recipe.slug,
            imageUrl: recipe.imageUrl,
            averageRating: recipe.averageRating
        }));
        res.status(200).json(limitedRecipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/recipes/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        let recipe = null;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            recipe = await Recipe.findById(identifier);
        }
        if (!recipe) {
            recipe = await Recipe.findOne({ slug: identifier });
        }
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/recipes/:id', authenticateToken, async (req, res) => {
    try {
        const recipeId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ error: 'Invalid recipe ID' });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (recipe.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this recipe' });
        }

        await Recipe.findByIdAndDelete(recipeId);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const { message, type } = req.body;
        const feedback = new Feedback({
            userId: req?.user?.id,
            message,
            type,
            createdAt: new Date()
        });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/docs', async (req, res) => {
    try {
        const search = req.query.search ? req.query.search.toLowerCase() : '';
        const categoryQuery =
            req.query.category && req.query.category !== 'all'
                ? req.query.category.toLowerCase()
                : null;
        const docsPath = join(__dirname, '../docs');
        const filenames = await fsPromises.readdir(docsPath);
        const docsData = await Promise.all(
            filenames.map(async (filename) => {
                const filePath = join(docsPath, filename);
                const content = await fsPromises.readFile(filePath, 'utf8');
                const title = filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
                const category = 'general';
                return { title, category, content, filename };
            })
        );

        let filteredDocs = docsData;

        if (categoryQuery) {
            filteredDocs = filteredDocs.filter(
                (doc) =>
                    doc.category.toLowerCase().includes(categoryQuery) ||
                    doc.filename.toLowerCase().includes(categoryQuery)
            );
        }
        if (search) {
            filteredDocs = filteredDocs.filter(
                (doc) =>
                    doc.title.toLowerCase().includes(search) ||
                    doc.content.toLowerCase().includes(search)
            );
        }

        res.json(filteredDocs);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/sitemap.xml', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        const staticRoutes = [
            '/',
            '/recipe',
            '/recipes',
            '/privacy',
            '/terms',
            '/login',
            '/signup',
            '/forgot',
            '/profile',
            '/feedback',
            '/admin',
            '/docs'
        ];

        let urls = staticRoutes
            .map((route) => `<url><loc>https://MyHealthy.Food${route}</loc></url>`)
            .join('');

        recipes.forEach((r) => {
            if (r.slug) {
                urls += `<url><loc>https://MyHealthy.Food/recipe/${r.slug}</loc></url>`;
            }
        });

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/landing.html'), 'utf8');
    res.send(html);
});

app.get('*', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/index.html'), 'utf8');
    if (!req.path.startsWith('/recipe/')) {
        return res.send(html);
    }
    const slug = req.path.substring(8);
    const enrichedHtml = await enrichRecipeMetadata(html, slug);
    res.send(enrichedHtml);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}`, `Exception origin: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './google.json';
