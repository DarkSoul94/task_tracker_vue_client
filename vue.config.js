module.exports = {
    devServer: {
      proxy: {
        '^/task_tracker': {
          //target: 'http://localhost:8585',
          target: 'http://10.54.86.26:8888',
          ws: true,
          changeOrigin: true
        }
      }
    }
  }
  