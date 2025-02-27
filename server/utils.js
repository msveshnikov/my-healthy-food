import { load } from 'cheerio';

export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

export const enrichRecipeMetadata = async (html, recipe) => {
    try {
        if (!recipe || !recipe.slug) return html;

        const $ = load(html);
        const title = recipe.seoTitle || recipe.title;
        const description = recipe.seoDescription || recipe.description;
        const imageUrl =
            recipe.images && recipe.images.length > 0
                ? recipe.images[0]
                : 'https://MyHealthy.Food/image1.jpg'; // Default image

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
                    url: 'https://MyHealthy.Food/logo.png' // Replace with your logo URL
                }
            }
        };

        $('head').append(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);

        return $.html();
    } catch (error) {
        console.error('Error enriching recipe metadata:', error);
        return html;
    }
};
