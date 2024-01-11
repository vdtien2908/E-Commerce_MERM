const userRouter = require('./User');
const { notFound, errHandler } = require('../http/middlewares/errHandler');

const initRoutes = (app) => {
    app.use('/api/user', userRouter);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
