import config from './knexfile';
import knex from 'knex';

export default knex(config[process.env.NODE_ENV || 'development']);
