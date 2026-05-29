const env = process.env.START_MODE;

// module.exports = {
//   apps: [{
//     name: 'cms.vagclub21.ru',
//     instance_var: 'INSTANCE_ID',
//     script: (env === 'development') ? 'npm run dev' : 'npm run build && npm run start',
//     watch: false,
//     wait_ready: true,
//     // out_file: path.resolve(__dirname, 'logs/web.out.log'), //?
//     // error_file: path.resolve(__dirname, 'logs/web.error.log'), //?
//     env: { NODE_ENV: env }
//   }]
// }

module.exports = {
  apps: [{
    name: 'cms.vagclub21.ru',
    script: 'npm', // Запускаем npm
    args: 'run start', // Аргументы для npm
    watch: false,
    wait_ready: true,
    env: {
      NODE_ENV: env,
      PORT: 3060 // Важно указать порт здесь, так как в package.json он тоже есть
    },
    // Если вы хотите использовать development режим через pm2 (не рекомендуется для прода):
    // env_development: {
    //   NODE_ENV: 'development',
    //   START_MODE: 'development'
    // }
  }]
};
