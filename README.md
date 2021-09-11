### Electronux
--------------
Build for Ubuntu20.04 desktop -- [ startup configure | software installer | system cleaner | check running state ]. Powered by Electron v9, React v16, Node v8, Mobx v4, Webpack v4, shell scripts.

#### Env Prepare (for china developers)
1. change electron mirrors settting  
```sh
$: npm config set electron_mirror http://npm.taobao.org/mirrors/electron/
$: npm config set electron_custom_dir "9.3.5"
$: npm install
$: npm install electron@9.3.5 -g
$: npm install cross-env -g
```

#### Commands

* 【npm start】 -- start webpack-dev-server and electron together(only show electron log info).
* 【npm run start-web】 -- start webpack-dev-server.
* 【npm run start-electron】 -- start electron main process(GUI) and load localhost:3000 (http).
* 【npm run start-production】 -- start electron main process(GUI) and load dist resources (local).
* 【npm run start-dll】 -- dll the static library with webpack.
* 【npm run dist】 -- compile and package the frontend resources.
* 【npm run build-before】 -- the pre step before build application.
* 【npm run build-after】 -- the next step after build application.
* 【npm run build】 -- build application using dist resources.
* 【npm run build-all】 -- build application after run `npm run dist`.

#### screenshots
----------------

![install_list](resources/screenshots/install_list.png)

![install_permission](resources/screenshots/install_permission.png)

![install_detail](resources/screenshots/install_detail.png)

![electron_password](resources/screenshots/electron_password.png)

![clean_detail](resources/screenshots/clean_detail.png)

![clean_search](resources/screenshots/clean_search.png)

![startup_list](resources/screenshots/startup_list.png)

![info_total](resources/screenshots/info_total.png)

![blogs_page](resources/screenshots/blogs_page.png)

