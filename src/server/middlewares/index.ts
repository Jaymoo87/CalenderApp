import type { RequestHandler } from 'express';

import db from '../db';
import utils from '../utils';

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password)
    return res.status(400).json({ message: 'You must have both email/username and password to log in.' });

  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  const isEmail = email.match(emailPattern);

  try {
    const [user] = await db.users.find_by(isEmail ? 'email' : 'username', email);
    if (!user) return res.status(401).json({ message: 'Credentials do not match' });

    const passwords_match = await utils.passwords.passwords_match(password, user.password);
    if (!passwords_match) return res.status(400).json({ message: 'Credentials do not match' });

    if (!user.email_verified) {
      // resend the email with a new code and invalidate previous codes

      return res.status(403).json({
        message: 'Verify your email before logging in, check your inbox for new email (expires in 10 minutes)',
      });
    } else {
      const { id, email, username, name } = user;
      const token = utils.tokens.sign({ id, email, username, name });
      res.status(200).json({ message: 'Congrats, you are logged in', token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not log in at this time, try again later' });
  }
};

const token_check: RequestHandler = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) return res.status(401).json({ message: 'Missing Auth Headers' });

  const [type, token] = authHeaders.split(' ');

  if (!type || !token || type.toLowerCase() !== 'bearer')
    return res.status(401).json({ message: 'Invalid Auth Header' });
  try {
    const payload = utils.tokens.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    const err = error as Error;
    console.log(error);
    res.status(401).json({ message: 'Unable to verify token - ' + err.message });
  }
};

export default {
  login,
  token_check,
};
