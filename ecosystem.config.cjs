module.exports = {
  apps: [
    {
      name: "learnjsback",
      cwd: "./learnjsback",
      script: "./server.js",
      // instances: "1",
      // exec_mode: "cluster",
      watch: "./build",
    },
    {
      name: "learnjsfront",
      script: "serve",
      watch: "./learnjsvite/dist",
      // instances: "1",
      // exec_mode: "cluster",
      env: {
        PM2_SERVE_PATH: "./learnjsvite/dist",
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: "true",
      },
    },
  ],
};
