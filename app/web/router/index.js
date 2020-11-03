import BlogsPage from '../views/blogs/blogsdPage';
import CleanPage from '../views/clean/CleanPage';
import CleanDetailPage from '../views/clean/CleanDetail';
import InfoPage from '../views/info/InfoPage';
import InstallPage from '../views/install/InstallPage';
import StartupPage from '../views/startup/StartupPage';
import HomePage from '../views/HomePage';

const routes = 
  {
    path: "/",
    component: HomePage,
    routes: [
      {
        path: "/install",
        component: InstallPage,
      },
      {
        path: "/startup",
        component: StartupPage,
      },
      {
        path: "/clean",
        exact: true,
        component: CleanPage
      },
      {
        path: "/clean/detail",
        component: CleanDetailPage
      },
      {
        path: "/info",
        component: InfoPage,
      },
      {
        path: "/blogs",
        component: BlogsPage,
      },
    ]
  };

export default routes;