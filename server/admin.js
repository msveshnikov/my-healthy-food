import { authenticateToken, isAdmin } from './middleware/auth.js';
import User from './models/User.js';
import Recipe from './models/Recipe.js';
import Feedback from './models/Feedback.js';

const adminRoutes = (app) => {
    app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
        try {
            const users = await User.find().select('-password').sort({ createdAt: -1 });
            res.json(users);
        } catch (error) {
            console.error('Admin users fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/dashboard', authenticateToken, isAdmin, async (req, res) => {
        try {
            const [
                totalUsers,
                premiumUsers,
                trialingUsers,
                totalRecipes,
                userGrowth,
                recipeGrowth
            ] = await Promise.all([
                User.countDocuments(),
                User.countDocuments({ subscriptionStatus: 'active' }),
                User.countDocuments({ subscriptionStatus: 'trialing' }),
                Recipe.countDocuments(),
                User.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } },
                    { $limit: 30 }
                ]),
                Recipe.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } },
                    { $limit: 30 }
                ])
            ]);
            const conversionRate =
                totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) : '0.00';
            res.json({
                stats: {
                    totalUsers,
                    premiumUsers,
                    trialingUsers,
                    conversionRate
                },
                userGrowth,
                recipesStats: {
                    totalRecipes,
                    recipeGrowth
                }
            });
        } catch (error) {
            console.error('Admin dashboard error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/feedbacks', authenticateToken, isAdmin, async (req, res) => {
        try {
            const feedbacks = await Feedback.find()
                .populate('userId', 'email')
                .sort({ createdAt: -1 });
            res.json(feedbacks);
        } catch (error) {
            console.error('Admin feedbacks fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/recipes', authenticateToken, isAdmin, async (req, res) => {
        try {
            const recipes = await Recipe.find()
                .populate('userId', 'email')
                .sort({ createdAt: -1 });
            res.json(recipes);
        } catch (error) {
            console.error('Admin recipes fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get(
        '/api/admin/recipes-model-stats',
        authenticateToken,
        isAdmin,
        async (req, res) => {
            try {
                const modelStats = await Recipe.aggregate([
                    {
                        $group: {
                            _id: '$model',
                            count: { $sum: 1 }
                        }
                    }
                ]);
                res.json(modelStats);
            } catch (error) {
                console.error('Admin recipe model stats error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await Promise.all([Recipe.deleteMany({ userId: req.params.id })]);
            res.json({ message: 'User and associated data deleted successfully' });
        } catch (error) {
            console.error('Admin user delete error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.delete('/api/admin/feedbacks/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const feedback = await Feedback.findByIdAndDelete(req.params.id);
            if (!feedback) {
                return res.status(404).json({ error: 'Feedback not found' });
            }
            res.json({ message: 'Feedback deleted successfully' });
        } catch (error) {
            console.error('Admin feedback delete error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.delete('/api/admin/recipes/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const recipe = await Recipe.findByIdAndDelete(req.params.id);
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            res.json({ message: 'Recipe deleted successfully' });
        } catch (error) {
            console.error('Admin recipe delete error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put('/api/admin/users/:id/subscription', authenticateToken, isAdmin, async (req, res) => {
        try {
            const { subscriptionStatus } = req.body;
            if (
                ![
                    'active',
                    'free',
                    'trialing',
                    'past_due',
                    'canceled',
                    'incomplete_expired'
                ].includes(subscriptionStatus)
            ) {
                return res.status(400).json({ error: 'Invalid subscription status' });
            }
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.subscriptionStatus = subscriptionStatus;
            await user.save();
            res.json({ message: 'User subscription updated successfully' });
        } catch (error) {
            console.error('Admin subscription update error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put(
        '/api/admin/recipes/:id/privacy',
        authenticateToken,
        isAdmin,
        async (req, res) => {
            try {
                const { isPrivate } = req.body;
                if (typeof isPrivate !== 'boolean') {
                    return res.status(400).json({ error: 'Invalid private status' });
                }
                const recipe = await Recipe.findById(req.params.id);
                if (!recipe) {
                    return res.status(404).json({ error: 'Recipe not found' });
                }
                recipe['isPrivate'] = isPrivate;
                await recipe.save();
                res.json({ message: 'Recipe privacy status updated successfully' });
            } catch (error) {
                console.error('Admin recipe privacy update error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );
};

export default adminRoutes;