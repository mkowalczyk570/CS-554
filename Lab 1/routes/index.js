import sitblog_routes from './sitblog_routes.js'

const constructorMethod = (app) =>{
    app.use('/', sitblog_routes);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
    });
}

export default constructorMethod;