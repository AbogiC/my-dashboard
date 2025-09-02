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
        <h1 class="text-3xl font-bold">Learning Management</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Create and manage your courses and lessons
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2 sm:space-x-4">
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

        <!-- Public Courses Button -->
        <button
          @click="$router.push('/public-courses')"
          :class="[
            'px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2',
            isDark
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white',
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
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
            ></path>
          </svg>
          <span class="hidden sm:inline">Public Courses</span>
        </button>

        <!-- Back to Dashboard Button -->
        <button
          @click="$router.push('/dashboard')"
          :class="[
            'px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2',
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
          <span class="hidden sm:inline">Dashboard</span>
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
      <!-- Create Course Button -->
      <div class="mb-6">
        <button
          @click="openCreateCourseModal"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2',
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white',
          ]"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span>Create New Course</span>
        </button>
      </div>

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
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    course.is_public
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                  ]"
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
                      :d="
                        course.is_public
                          ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          : 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      "
                    ></path>
                  </svg>
                  {{ course.is_public ? "Public" : "Private" }}
                </span>
              </div>
            </div>
            <button
              @click.stop="openEditCourseModal(course)"
              class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ml-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>
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
              @click.stop="deleteCourse(course.id)"
              class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
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
        <h3 class="text-xl font-medium mb-2">No courses yet</h3>
        <p class="mb-4">
          Create your first course to get started with learning management.
        </p>
        <button
          @click="openCreateCourseModal"
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

    <!-- Create/Edit Course Modal -->
    <div
      v-if="showCourseModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeCourseModal"
    >
      <div
        :class="[
          'w-full max-w-md mx-4 rounded-lg shadow-xl transition-colors duration-300',
          isDark ? 'bg-gray-800' : 'bg-white',
        ]"
        @click.stop
      >
        <!-- Modal Header -->
        <div
          :class="[
            'flex items-center justify-between p-6 border-b transition-colors duration-300',
            isDark ? 'border-gray-700' : 'border-gray-200',
          ]"
        >
          <h3 class="text-lg font-semibold">
            {{ editingCourse ? "Edit Course" : "Create New Course" }}
          </h3>
          <button
            @click="closeCourseModal"
            :class="[
              'p-1 rounded-full hover:bg-opacity-80 transition-colors',
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
            ]"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <form @submit.prevent="saveCourse">
            <!-- Course Title -->
            <div class="mb-4">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Course Title *
              </label>
              <input
                v-model="courseForm.title"
                type="text"
                required
                placeholder="Enter course title..."
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
                ]"
              />
            </div>

            <!-- Course Description -->
            <div class="mb-4">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Description
              </label>
              <textarea
                v-model="courseForm.description"
                rows="4"
                placeholder="Enter course description..."
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300 resize-none',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
                ]"
              ></textarea>
            </div>

            <!-- Public/Private Toggle -->
            <div class="mb-6">
              <label
                :class="[
                  'block text-sm font-medium mb-3',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Visibility
              </label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="courseForm.is_public"
                    :value="false"
                    class="mr-2"
                  />
                  <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                    Private (Only you can see this course)
                  </span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="courseForm.is_public"
                    :value="true"
                    class="mr-2"
                  />
                  <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                    Public (Anyone can view this course)
                  </span>
                </label>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex space-x-3">
              <button
                type="button"
                @click="closeCourseModal"
                :class="[
                  'flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300',
                  isDark
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700',
                ]"
              >
                Cancel
              </button>
              <button
                type="submit"
                :class="[
                  'flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300',
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white',
                ]"
                :disabled="!courseForm.title.trim()"
              >
                {{ editingCourse ? "Update" : "Create" }} Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import databaseService from "../services/databaseService";

const router = useRouter();

const userId = ref(null);
const courses = ref([]);
const loading = ref(true);
const isDark = ref(false);
const showCourseModal = ref(false);
const editingCourse = ref(null);
const courseForm = ref({
  title: "",
  description: "",
  is_public: false,
});

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
    fetchCourses();
  } else {
    loading.value = false;
  }

  // Add logs for debugging responsiveness
  console.log("Learning.vue - Initial window width:", window.innerWidth);
  window.addEventListener("resize", () => {
    console.log("Learning.vue - Window resized to:", window.innerWidth);
    // Check if action buttons container is overflowing
    const actionButtons = document.querySelector(
      ".flex.items-center.space-x-4"
    );
    if (actionButtons) {
      const containerWidth = actionButtons.offsetWidth;
      const scrollWidth = actionButtons.scrollWidth;
      console.log(
        "Learning.vue - Action buttons container width:",
        containerWidth,
        "Scroll width:",
        scrollWidth
      );
      if (scrollWidth > containerWidth) {
        console.log("Learning.vue - Action buttons are overflowing!");
      }
    }
  });
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

async function fetchCourses() {
  if (!userId.value) return;

  try {
    loading.value = true;
    courses.value = await databaseService.getCourses(userId.value);
  } catch (error) {
    console.error("Error fetching courses:", error);
    courses.value = [];
  } finally {
    loading.value = false;
  }
}

function openCreateCourseModal() {
  editingCourse.value = null;
  courseForm.value = {
    title: "",
    description: "",
    is_public: false,
  };
  showCourseModal.value = true;
}

function openEditCourseModal(course) {
  editingCourse.value = course;
  courseForm.value = {
    title: course.title,
    description: course.description || "",
    is_public: course.is_public || false,
  };
  showCourseModal.value = true;
}

function closeCourseModal() {
  showCourseModal.value = false;
  editingCourse.value = null;
  courseForm.value = {
    title: "",
    description: "",
    is_public: false,
  };
}

async function saveCourse() {
  if (!userId.value || !courseForm.value.title.trim()) return;

  try {
    if (editingCourse.value) {
      // Update existing course
      await databaseService.updateCourse(
        editingCourse.value.id,
        courseForm.value.title,
        courseForm.value.description,
        courseForm.value.is_public
      );
      // Update local state
      const index = courses.value.findIndex(
        (c) => c.id === editingCourse.value.id
      );
      if (index !== -1) {
        courses.value[index] = { ...courses.value[index], ...courseForm.value };
      }
      alert("Course updated successfully!");
    } else {
      // Create new course
      const response = await databaseService.addCourse(
        userId.value,
        courseForm.value.title,
        courseForm.value.description,
        courseForm.value.is_public
      );
      courses.value.unshift(response);
      alert("Course created successfully!");
    }
    closeCourseModal();
  } catch (error) {
    console.error("Error saving course:", error);
    alert("Failed to save course. Please try again.");
  }
}

async function deleteCourse(courseId) {
  if (
    !confirm(
      "Are you sure you want to delete this course? This will also delete all its lessons."
    )
  ) {
    return;
  }

  try {
    await databaseService.deleteCourse(courseId);
    courses.value = courses.value.filter((c) => c.id !== courseId);
    alert("Course deleted successfully!");
  } catch (error) {
    console.error("Error deleting course:", error);
    alert("Failed to delete course. Please try again.");
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
