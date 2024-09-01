module.exports = {
    apps: [{
        name: "app",
        script: "export NODE_ENV=prod && dist/server.js",
        instances: 0,
        exec_mode: "cluster",
        node_args: "--max-old-space-size=5120 -r dotenv/config",
    }]
}