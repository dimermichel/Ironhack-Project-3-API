module.exports = (req, res, next) => {
  req.isAuthenticated() ? next() : res.status(401).json({ message: 'You must log in first. 🤷‍♂️' });
};
