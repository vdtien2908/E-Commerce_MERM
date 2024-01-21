const { notFound, errHandler } = require('../http/middlewares/errHandler');

const authRouter = require('./authRouter');
const userRouter = require('./userRouter');

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);

    // Handle error
    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
