const { notFound, errHandler } = require('../http/middlewares/errHandler');

const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/products', productRouter);
    app.use('/api/categories', categoryRouter);

    // Handle error
    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
