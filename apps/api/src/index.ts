import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Entarium API is live!' });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
