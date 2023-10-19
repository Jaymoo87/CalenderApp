import passwords from '../utils/passwords';
import db from '../db';
import type { RequestHandler } from 'express';

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password)
    return res.status(400).json({ message: 'You must have both email/username and password to log in.' });

  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  const isEmail = email.match(emailPattern);

  try {
    const [user] = await db.users.find_by(isEmail ? 'email' : 'username', email);
    if (!user) return res.status(401).json({ message: 'Credentials dont match' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not log in at this time, try again later' });
  }
};
