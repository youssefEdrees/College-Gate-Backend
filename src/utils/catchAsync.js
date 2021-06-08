module.exports = fn => {
    return async (req, res, next) => {
      try {
        console.log(req.path, req.query, req.body);
        await fn(req, res, next);
      } catch (err) {
        //next(err);
        return next(err);
      }
    };
  };
  