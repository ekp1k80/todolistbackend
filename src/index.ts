import express, { NextFunction, Request, Response } from "express";
import {auth} from 'express-openid-connect'
import authMiddleware  from "./middleware/authMiddleware";
import todoRoutes from "./routes/todoRoutes";
import swaggerUI from 'swagger-ui-express'
import swaggerSpecs from './swagger/swagger'
const app = express();
const PORT = 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASEURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Middleware
app.use(express.json());

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use("/apidocs",swaggerUI.serve, swaggerUI.setup(swaggerSpecs))

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.use("/api/todos", authMiddleware, todoRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;