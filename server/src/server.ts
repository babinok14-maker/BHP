import app from "./app";
import { env } from "./config/env";

const start = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port} [${env.nodeEnv}]`);
  });

  server.on("error", (err: any) => {
    if (err && err.code === "EADDRINUSE") {
      console.warn(`Port ${port} in use, trying ${port + 1}`);
      // try next port
      start(port + 1);
    } else {
      throw err;
    }
  });
};

start(Number(env.port));
