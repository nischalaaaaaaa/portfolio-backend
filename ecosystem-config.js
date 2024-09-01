module.exports = {
    apps: [{
        name: "app",
        script: "dist/server.js",
        instances: 0,
        exec_mode: "cluster",
        node_args: "export NDE_ENV=prod --max-old-space-size=5120 -r dotenv/config",
    }]
}