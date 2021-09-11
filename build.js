const path = require('path');
const fs = require('fs');
const { copyDirSync, exec, execRealtime, console_log, removeDirSync } = require('./build.utils');

/*
   * 函数调用list
   * @param build:before 构建前准备
   * @param --help | -h 查看帮助信息
   */
const func = {
  envMap: {
    '-l': 'linux',
    'l': 'linux',
    'linux': 'linux',
    'windows': 'windows',
    'w': 'windows',
    '-w': 'windows',
  },
  'test': () => {
    copyDirSync('./view/dist', './service/dist');
  },
  /* build before teps */
  'build:before': async (env) => {
    console_log('>>>>>> build:before ...');
    await execRealtime(`shx mkdir -p build`);
    await execRealtime(`shx rm -rf ./build`);
    await copyDirSync('./resources/', './build/')
  },
  /* build web */
  'build:web': async (env) => {
    console_log('>>>>>> build:web ...');
    await execRealtime(`npm run build`, { cwd: './app/web' });
    await execRealtime(`shx mkdir -p dist`);
    await execRealtime(`shx rm -rf ./dist`);
    await copyDirSync('./app/web/dist/', './dist/')
  },
  /* build web & main */
  'build': async (env) => {
    console_log('>>>>>> build ...');
    await func['build:before']();
    await func['build:web']();
    await execRealtime(`electron-builder --${func.envMap[env] || 'linux'}`);
  },
  'clean-build': async (env) => {
    await execRealtime('node ./build.js clean-build', { cwd: './service' });
    if (fs.existsSync('./view/dist')) {
      removeDirSync('./view/dist');
    }
    await execRealtime('git checkout -- dist', { cwd: './view' });
    console_log(`\nclean finishied!`);
  },
  /* build command usage */
  '--help': () => {
    console_log('\
    \n\
    description: build command for RhinoDisk.\n\
    command: node build.js [action] [config]\n\
    |\n\
    |\n\
    |______ param: [--help | -h ] => show usage info.\n\
    |______ param: [build-win   ] [--edit | --office] => build package for windows, the default conf file is ./service/config.json.\n\
    |______ param: [build-linux ] [--edit | --office] => build package for linux, the default conf file is ./service/config.json\n\
    |______ param: [build-mac   ] [--edit | --office] => build package for mac, the default conf file is ./service/config.json\n\
    |______ param: [build-all   ] [--edit | --office] => build package for all platform, the default conf file is ./service/config.json\n\
    |______ param: [clean-build ] => clean build directory after build\n\
    |\n\
    |______ example1: node build.js build-win\n\
    |______ example2: node build.js build-linux\n\
    |______ example3: node build.js build-mac\n\
    |______ example4: node build.js build-all\n\
    |______ example5: node build.js build-win --edit\n\
    |______ example6: node build.js build-win --office\n\
    |______ example7: node build.js --help\n\
    |______ example8: node build.js clean-build\n\
    \n\
    ')
  },
  '-h': () => {
    func['--help']();
  }
};

/* Main */
function Main() {
  const params = process.argv.splice(2);
  const indexArray = [];
  let args;

  params.forEach((key, i) => {
    if (func[key] && (typeof func[key] === 'function')) indexArray.push(i);
  });

  /* single command */
  if (indexArray.length === 1) {
    return func[params[indexArray[0]]](...params.slice(1));
  }
  
  /* multi command */
  indexArray.forEach((index, i) => {
    args = indexArray.slice(
      index + 1,
      indexArray[i + 1]
    ).map(i => params[i]);

    if (args.length)
      func[params[index]](...args);
    else
      func[params[index]]('');
  });
}

Main();