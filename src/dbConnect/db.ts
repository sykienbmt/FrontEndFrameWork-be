
import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'assignment',
    port: 5432
});

// export const pool = new Pool({
//     user: 'postgres',
//     host: 'containers-us-west-11.railway.app',
//     password: 'ZG2O3b90yo3FX3rAYgil',
//     database: 'railway',
//     port: 6015
// });


