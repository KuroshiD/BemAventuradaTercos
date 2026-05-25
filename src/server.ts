import app from './api/app';
import env from './env';

const { port, nginx_port } = env;

const getServerUrl = (port: number, nginxPort: number) => {
    if (nginxPort === 80) return 'http://localhost';
    if (nginxPort === 443) return 'https://localhost';
    return `http://localhost:${port}`;
};

app.listen(port, () => {
    console.log(`Server is running on ${getServerUrl(port, nginx_port)}`);
});