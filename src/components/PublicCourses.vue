<template>
  <div
    :class="[
      'min-h-screen p-6 transition-colors duration-300',
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800',
    ]"
  >
    <!-- Header -->
    <header class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Public Courses</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Explore courses shared by other users
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-4">
        <!-- Theme Toggle Button -->
        <button
          @click="toggleTheme"
          :class="[
            'p-2 rounded-full transition-all duration-300 flex items-center justify-center',
            isDark
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-gray-800 text-yellow-400',
          ]"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <component :is="isDark ? SunIcon : MoonIcon" class="w-6 h-6" />
        </button>

        <!-- Back to Learning Button -->
        <button
          @click="$router.push('/learning')"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2',
            isDark
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700',
          ]"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          <span>My Courses</span>
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Courses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in courses"
          :key="course.id"
          :class="[
            'rounded-lg shadow p-6 transition-all duration-300 cursor-pointer hover:shadow-lg',
            isDark
              ? 'bg-gray-800 hover:bg-gray-750'
              : 'bg-white hover:bg-gray-50',
          ]"
          @click="viewCourse(course.id)"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <h3 class="text-xl font-semibold truncate">
                  {{ course.title }}
                </h3>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  Public
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                by {{ course.author_name || "Anonymous" }}
              </p>
            </div>
          </div>

          <p
            :class="[
              'text-sm mb-4 line-clamp-3',
              isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            {{ course.description || "No description available" }}
          </p>

          <div class="flex justify-between items-center">
            <span
              :class="['text-xs', isDark ? 'text-gray-500' : 'text-gray-500']"
            >
              {{ course.total_lessons }} lessons
            </span>
            <button
              @click="viewCourse(course.id)"
              :class="[
                'px-3 py-1 rounded text-sm font-medium transition-colors duration-300',
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
              ]"
            >
              View Course
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="courses.length === 0"
        :class="[
          'text-center py-12',
          isDark ? 'text-gray-400' : 'text-gray-600',
        ]"
      >
        <svg
          class="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          ></path>
        </svg>
        <h3 class="text-xl font-medium mb-2">No public courses available</h3>
        <p class="mb-4">Be the first to share a course by making one public!</p>
        <button
          @click="$router.push('/learning')"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors duration-300',
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white',
          ]"
        >
          Create Your First Course
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import api from "../services/api";

const router = useRouter();

const userId = ref(null);
const courses = ref([]);
const loading = ref(true);
const isDark = ref(false);

// Load theme preference from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  applyTheme();

  // Get user data from localStorage
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    userId.value = storedUserId;
    fetchPublicCourses();
  } else {
    loading.value = false;
  }
});

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme() {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
  applyTheme();
}

async function fetchPublicCourses() {
  if (!userId.value) return;

  try {
    loading.value = true;
    const response = await api.getPublicCourses();
    courses.value = response.data;
  } catch (error) {
    console.error("Error fetching public courses:", error);
    courses.value = [];
  } finally {
    loading.value = false;
  }
}

function viewCourse(courseId) {
  router.push(`/learning/${courseId}`);
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
