module.exports = {
  apps : [{
    name      : 'ppt-bot',
    script    : './src/bot/bot.js',
    watch: false,
    instance_var: 'INSTANCE_ID',
    env: {
	NODE_ENV: 'production',
	NODE_CONFIG_DIR: './config/',
	NODE_PATH: './ppt'
    },
//    env_production : {
//      NODE_ENV: 'production'
//    }
  }],

/*
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
*/
};
