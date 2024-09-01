module.exports = {
    apps: [{
        name: "app",
        script: "dist/server.js",
        instances: 0,
        exec_mode: "cluster",
        node_args: "export NODE_ENV=prod --max-old-space-size=5120 -r dotenv/config",
    }]
}