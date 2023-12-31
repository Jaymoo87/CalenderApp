import { Query } from '../connection';
import type { User } from '../../types';

type Columns = 'id' | 'email' | 'username';

const all = () => Query<User[]>('SELECT * FROM users');
const find_by = (column: Columns, value: string | number) =>
  Query<User[]>('SELECT * FROM users WHERE $1=$2', [column, value]);
const create = ({ name, email, username, password, phone }: User) =>
  Query('INSERT INTO Users(name, email, username, password, phone) Values ($1, $2, $3, $4, $5)', [
    name,
    email,
    username,
    password,
    phone,
  ]);

const update_mfa = (preference: User['mfa_preference'], id: User['id']) =>
  Query('UPDATE users SET mfa_preference=$1 WHERE id=$2', [preference, id]);

export default {
  all,
  find_by,
  create,
  update_mfa,
};
