{
  "version": 2,
  "functions": {
    "server.js": {
      "runtime": "@vercel/node"
    }
  },
  "routes": [
    {
      "src": "/bfhl",
      "dest": "/server.js"
    },
    {
      "src": "/",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
