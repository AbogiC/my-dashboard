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
        <h1 class="text-3xl font-bold">{{ lesson.title }}</h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ course.title }} • Lesson {{ currentLessonIndex + 1 }} of
          {{ totalLessons }}
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

        <!-- Back to Course Button -->
        <button
          @click="$router.push(`/learning/${course.id}`)"
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
          <span>Back to Course</span>
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
    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-3">
        <div
          :class="[
            'rounded-lg shadow p-8 transition-colors duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <div
            v-if="lesson.content"
            class="prose prose-lg max-w-none"
            :class="isDark ? 'prose-invert' : ''"
          >
            <div class="whitespace-pre-wrap">{{ lesson.content }}</div>
          </div>
          <div
            v-else
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <h3 class="text-xl font-medium mb-2">No content available</h3>
            <p>This lesson doesn't have any content yet.</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <!-- Lesson Navigation -->
        <div
          :class="[
            'rounded-lg shadow p-6 mb-6 transition-colors duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <h3 class="text-lg font-semibold mb-4">Course Lessons</h3>
          <div class="space-y-2">
            <button
              v-for="(lessonItem, index) in allLessons"
              :key="lessonItem.id"
              @click="navigateToLesson(lessonItem.id)"
              :class="[
                'w-full text-left p-3 rounded-lg transition-colors duration-300 flex items-center space-x-3',
                lessonItem.id === lesson.id
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700',
              ]"
            >
              <div
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                  lessonItem.id === lesson.id
                    ? 'bg-white text-blue-600'
                    : isDark
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-gray-300 text-gray-700',
                ]"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">
                  {{ lessonItem.title }}
                </p>
              </div>
            </button>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div
          :class="[
            'rounded-lg shadow p-6 transition-colors duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <div class="space-y-3">
            <button
              v-if="hasPreviousLesson"
              @click="goToPreviousLesson"
              :class="[
                'w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2',
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
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              <span>Previous Lesson</span>
            </button>

            <button
              v-if="hasNextLesson"
              @click="goToNextLesson"
              :class="[
                'w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2',
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
              ]"
            >
              <span>Next Lesson</span>
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
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>

            <button
              v-if="!hasNextLesson"
              @click="$router.push('/learning')"
              :class="[
                'w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2',
                isDark
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white',
              ]"
            >
              <span>Complete Course</span>
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
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import api from "../services/api";

const router = useRouter();
const route = useRoute();

const userId = ref(null);
const course = ref({});
const lesson = ref({});
const allLessons = ref([]);
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
    fetchLesson();
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

async function fetchLesson() {
  if (!userId.value || !route.params.courseId || !route.params.lessonId) return;

  try {
    loading.value = true;

    // Fetch course with lessons
    const courseResponse = await api.getCourse(
      userId.value,
      route.params.courseId
    );
    course.value = courseResponse.data;
    allLessons.value = courseResponse.data.lessons || [];

    // Find the specific lesson
    const currentLesson = allLessons.value.find(
      (l) => l.id == route.params.lessonId
    );
    if (currentLesson) {
      lesson.value = currentLesson;
    } else {
      // If lesson not found, redirect to course
      router.push(`/learning/${route.params.courseId}`);
    }
  } catch (error) {
    console.error("Error fetching lesson:", error);
    course.value = {};
    lesson.value = {};
    allLessons.value = [];
  } finally {
    loading.value = false;
  }
}

const currentLessonIndex = computed(() => {
  return allLessons.value.findIndex((l) => l.id == lesson.value.id);
});

const totalLessons = computed(() => {
  return allLessons.value.length;
});

const hasPreviousLesson = computed(() => {
  return currentLessonIndex.value > 0;
});

const hasNextLesson = computed(() => {
  return currentLessonIndex.value < allLessons.value.length - 1;
});

function navigateToLesson(lessonId) {
  router.push(`/learning/${course.value.id}/lesson/${lessonId}`);
}

function goToPreviousLesson() {
  if (hasPreviousLesson.value) {
    const prevLesson = allLessons.value[currentLessonIndex.value - 1];
    navigateToLesson(prevLesson.id);
  }
}

function goToNextLesson() {
  if (hasNextLesson.value) {
    const nextLesson = allLessons.value[currentLessonIndex.value + 1];
    navigateToLesson(nextLesson.id);
  }
}
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose-invert {
  --tw-prose-body: rgb(209 213 219);
  --tw-prose-headings: rgb(255 255 255);
  --tw-prose-lead: rgb(156 163 175);
  --tw-prose-links: rgb(59 130 246);
  --tw-prose-bold: rgb(255 255 255);
  --tw-prose-counters: rgb(156 163 175);
  --tw-prose-bullets: rgb(156 163 175);
  --tw-prose-hr: rgb(75 85 99);
  --tw-prose-quotes: rgb(255 255 255);
  --tw-prose-quote-borders: rgb(75 85 99);
  --tw-prose-captions: rgb(156 163 175);
  --tw-prose-code: rgb(209 213 219);
  --tw-prose-pre-code: rgb(209 213 219);
  --tw-prose-pre-bg: rgb(31 41 55);
  --tw-prose-th-borders: rgb(75 85 99);
  --tw-prose-td-borders: rgb(75 85 99);
}
</style>
