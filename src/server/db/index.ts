import pg from 'pg';
import config from '../config';

const pool = new pg.Pool(config.pg);

const Query = <T>(sql: string, values: [] = []) => {};
