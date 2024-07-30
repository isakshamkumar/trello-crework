import app from './App';
import { config } from './config/config';

const startServer = () => {
  try {
    app.get("/",(req,res)=>{
      res.send("Server Up!");
    })
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();