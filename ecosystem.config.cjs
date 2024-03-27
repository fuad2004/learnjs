module.exports = {
  apps: [
    {
      name: "learnjsback",
      script: "./learnjsback/server.js",
      cwd: "./learnjsback",
      instances: "1",
      exec_mode: "cluster",
      watch: "./learnjsback/build",
    },
    {
      name: "learnjsfront",
      script: "serve",
      watch: "./learnjsvite/dist",
      instances: "1",
      exec_mode: "cluster",
      env: {
        PM2_SERVE_PATH: "./learnjsvite/dist",
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: "true",
      },
    },
  ],
};
