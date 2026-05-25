import * as dotenv from 'dotenv'
dotenv.config();

const parseIntWithFallback = (value: string | undefined, fallback: number): number => {
    const parsed = parseInt(value ?? '', 10);
    return isNaN(parsed) ? fallback : parsed;
};

export default {
    port: parseIntWithFallback(process.env.PORT, 3000),
    clusters: parseIntWithFallback(process.env.CLUSTERS, 1),
    nginx_port: parseIntWithFallback(process.env.NGINX_PORT, 9999),
    db: process.env.DB ?? "db_api",
    db_user: process.env.DB_USER ?? "db_user",
    db_pass: process.env.DB_PASS ?? "db_pass"
}