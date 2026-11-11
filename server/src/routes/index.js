import { Router } from 'express';
import healthRoutes from './health.routes.js';
import profileRoutes from './profile.routes.js';
import farmRoutes from './farm.routes.js';
import cropRoutes from './crop.routes.js';
import soilRoutes from './soil.routes.js';
import fertilizerRoutes from './fertilizer.routes.js';
import irrigationRoutes from './irrigation.routes.js';
import diseaseRoutes from './disease.routes.js';
import calendarRoutes from './calendar.routes.js';
import chatRoutes from './chat.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const apiRouter = Router();

apiRouter.use('/', healthRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/farms', farmRoutes);
apiRouter.use('/crop', cropRoutes);
apiRouter.use('/soil', soilRoutes);
apiRouter.use('/fertilizer', fertilizerRoutes);
apiRouter.use('/irrigation', irrigationRoutes);
apiRouter.use('/disease', diseaseRoutes);
apiRouter.use('/calendar', calendarRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;

