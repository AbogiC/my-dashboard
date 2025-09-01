import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Dashboard from "./components/Dashboard.vue";
import Learning from "./components/Learning.vue";
import CourseDetail from "./components/CourseDetail.vue";
import LessonViewer from "./components/LessonViewer.vue";
import PublicCourses from "./components/PublicCourses.vue";
import "./style.css";

// Define routes
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/learning",
    name: "Learning",
    component: Learning,
    meta: { requiresAuth: true },
  },
  {
    path: "/public-courses",
    name: "PublicCourses",
    component: PublicCourses,
    meta: { requiresAuth: true },
  },
  {
    path: "/learning/:id",
    name: "CourseDetail",
    component: CourseDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/learning/:courseId/lesson/:lessonId",
    name: "LessonViewer",
    component: LessonViewer,
    meta: { requiresAuth: true },
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (to.path === "/login" && isLoggedIn) {
    next("/dashboard");
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");
