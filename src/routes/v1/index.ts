/**
 * Node modules
 */
import { Router } from "express";

/**
 * Routes
 */
import authRoutes from "./auth";
import userRoutes from "./user";
import portfolioRoutes from "./portfolio"
import experienceRotes from "./experience"
import messageRoutes from "./message"
import projectRoutes from "./project";



/**
 * Initial express router
 */
const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});


// routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

// portfolio routes
router.use('/portfolio/profile', portfolioRoutes);
router.use('/portfolio/experience', experienceRotes)
router.use('/portfolio/message', messageRoutes);
router.use('/portfolio/project', projectRoutes);


export default router;