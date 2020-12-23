import routes from "./routes";

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = "MeTube";
  res.locals.routes = routes;
  next();
};
