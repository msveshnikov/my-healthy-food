import { load } from 'cheerio';
import Recipe from './models/Recipe.js';
import { slugify as baseSlugify } from 'transliteration';

export const slugify = (text, language) => {
    const baseSlug = baseSlugify(text)
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
    return language ? `${language}-${baseSlug}` : baseSlug;
};

export const generateUniqueSlug = async (text, language) => {
    let slug = slugify(text, language);
    let count = 0;
    while (true) {
        const existingRecipe = await Recipe.findOne({ slug });
        if (!existingRecipe) {
            return slug;
        }
        count++;
        slug = `${slugify(text, language)}-${count}`;
    }
};

export const getIpFromRequest = (req) => {
    let ips = (
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        ''
    ).split(',');
    return ips[0].trim();
};

export const enrichRecipeMetadata = async (html, slug) => {
    try {
        const recipe = await Recipe.findOne({ slug });
        if (!recipe) return html;

        const $ = load(html);
        const title = recipe.seoTitle || recipe.title;
        const description = recipe.seoDescription || recipe.description;
        const imageUrl = recipe.imageUrl ?? 'https://MyHealthy.Food/image.jpg';
        $('title').text(`${title} | My Healthy Food`);
        $('meta[name="description"]').attr('content', description);
        $('meta[property="og:title"]').attr('content', title);
        $('meta[property="og:description"]').attr('content', description);
        $('meta[property="og:url"]').attr(
            'content',
            `https://MyHealthy.Food/recipe/${recipe.slug}`
        );
        $('meta[property="og:image"]').attr('content', imageUrl);
        $('meta[property="og:type"]').attr('content', 'recipe');

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Recipe',
            name: title,
            description: description,
            image: imageUrl,
            recipeIngredient: recipe.ingredients || [],
            recipeInstructions:
                recipe.instructions.map((instruction) => ({
                    '@type': 'HowToStep',
                    text: instruction
                })) || [],
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            totalTime: recipe.totalTime,
            recipeCuisine: recipe.cuisine,
            recipeCategory: recipe.dishType,
            keywords: recipe.tags ? recipe.tags.join(', ') : '',
            author: {
                '@type': 'Organization',
                name: 'My Healthy Food'
            },
            datePublished: recipe.createdAt,
            publisher: {
                '@type': 'Organization',
                name: 'My Healthy Food',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://MyHealthy.Food/android-chrome-192x192.png' // Replace with your logo URL
                }
            }
        };

        $('head').append(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
        $('body').append(generateRecipeHtmlBody(recipe));
        return $.html();
    } catch (error) {
        console.error('Error enriching recipe metadata:', error);
        return html;
    }
};

export const generateRecipeHtmlBody = (recipe) => {
    try {
        const $ = load('<html><body></body></html>');
        $('body').append(`<h1>${recipe.title}</h1>`);
        $('body').append(`<p>${recipe.description}</p>`);

        if (recipe.ingredients && recipe.ingredients.length > 0) {
            $('body').append('<h2>Ingredients</h2>');
            const ingredientsList = $('<ul></ul>');
            recipe.ingredients.forEach((ingredient) => {
                ingredientsList.append(`<li>${ingredient.name}</li>`);
            });
            $('body').append(ingredientsList);
        }

        if (recipe.instructions && recipe.instructions.length > 0) {
            $('body').append('<h2>Instructions</h2>');
            const instructionsList = $('<ol></ol>');
            recipe.instructions.forEach((instruction) => {
                instructionsList.append(`<li>${instruction}</li>`);
            });
            $('body').append(instructionsList);
        }

        return $.html();
    } catch (error) {
        console.error('Error generating recipe HTML body:', error);
        return '<div>Error generating recipe HTML.</div>';
    }
};
