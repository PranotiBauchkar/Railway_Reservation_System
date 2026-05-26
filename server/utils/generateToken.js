import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'smart_railway_secret_key_987654',
    {
      expiresIn: '30d',
    }
  );
};

export default generateToken;
