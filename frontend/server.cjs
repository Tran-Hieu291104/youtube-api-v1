const { config } = require("dotenv");
config({ path: "../server/.env" });

const { createServer } = require("vite");
const backendAppModule = require("../server/dist/index");

const backendApp = backendAppModule.default;

(async () => {
  const vite = await createServer({
    configFile: "./vite.config.js", // Dùng config từ file
    server: {
      middlewareMode: false,
    },
  });

  backendApp.use(vite.middlewares);

  const PORT = process.env.PORT || 3001;
  backendApp.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
