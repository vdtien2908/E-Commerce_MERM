const { notFound, errHandler } = require('../http/middlewares/errHandler');

const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/products', productRouter);

    // Handle error
    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
