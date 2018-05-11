import userRoutes from './User/user.routes';

export default (app) => {
    app.use('/user', userRoutes);
}