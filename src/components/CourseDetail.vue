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
        <h1 class="text-3xl font-bold">{{ course.title }}</h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ course.description || "No description available" }}
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
          <span>Back to Courses</span>
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
      <!-- Add Lesson Button -->
      <div class="mb-6">
        <button
          @click="openCreateLessonModal"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2',
            isDark
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white',
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
          <span>Add New Lesson</span>
        </button>
      </div>

      <!-- Lessons List -->
      <div class="space-y-4">
        <div
          v-for="(lesson, index) in lessons"
          :key="lesson.id"
          :class="[
            'rounded-lg shadow p-6 transition-all duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-4">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
                ]"
              >
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="text-xl font-semibold">{{ lesson.title }}</h3>
                <p
                  :class="[
                    'text-sm mt-1',
                    isDark ? 'text-gray-400' : 'text-gray-600',
                  ]"
                >
                  Lesson {{ index + 1 }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="viewLesson(lesson.id)"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium transition-colors duration-300',
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white',
                ]"
              >
                View
              </button>
              <button
                @click="openEditLessonModal(lesson)"
                :class="[
                  'px-3 py-1 rounded text-sm font-medium transition-colors duration-300',
                  isDark
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white',
                ]"
              >
                Edit
              </button>
              <button
                @click="deleteLesson(lesson.id)"
                class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
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

          <div
            v-if="lesson.content"
            :class="[
              'text-sm line-clamp-3',
              isDark ? 'text-gray-300' : 'text-gray-700',
            ]"
          >
            {{ lesson.content }}
          </div>
          <div
            v-else
            :class="[
              'text-sm italic',
              isDark ? 'text-gray-500' : 'text-gray-400',
            ]"
          >
            No content available
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="lessons.length === 0"
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
        <h3 class="text-xl font-medium mb-2">No lessons yet</h3>
        <p class="mb-4">
          Add your first lesson to get started with this course.
        </p>
        <button
          @click="openCreateLessonModal"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors duration-300',
            isDark
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white',
          ]"
        >
          Add Your First Lesson
        </button>
      </div>
    </div>

    <!-- Create/Edit Lesson Modal -->
    <div
      v-if="showLessonModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeLessonModal"
    >
      <div
        :class="[
          'w-full max-w-2xl mx-4 rounded-lg shadow-xl transition-colors duration-300',
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
            {{ editingLesson ? "Edit Lesson" : "Create New Lesson" }}
          </h3>
          <button
            @click="closeLessonModal"
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
          <form @submit.prevent="saveLesson">
            <!-- Lesson Title -->
            <div class="mb-4">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Lesson Title *
              </label>
              <input
                v-model="lessonForm.title"
                type="text"
                required
                placeholder="Enter lesson title..."
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-green-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-green-500',
                ]"
              />
            </div>

            <!-- Lesson Order -->
            <div class="mb-4">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Lesson Order
              </label>
              <input
                v-model.number="lessonForm.lesson_order"
                type="number"
                min="0"
                placeholder="0"
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-green-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-green-500',
                ]"
              />
            </div>

            <!-- Lesson Content -->
            <div class="mb-6">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Lesson Content
              </label>
              <textarea
                v-model="lessonForm.content"
                rows="8"
                placeholder="Enter lesson content..."
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300 resize-none',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-green-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-green-500',
                ]"
              ></textarea>
            </div>

            <!-- Modal Actions -->
            <div class="flex space-x-3">
              <button
                type="button"
                @click="closeLessonModal"
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
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white',
                ]"
                :disabled="!lessonForm.title.trim()"
              >
                {{ editingLesson ? "Update" : "Create" }} Lesson
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
import { useRouter, useRoute } from "vue-router";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import api from "../services/api";

const router = useRouter();
const route = useRoute();

const userId = ref(null);
const course = ref({});
const lessons = ref([]);
const loading = ref(true);
const isDark = ref(false);
const showLessonModal = ref(false);
const editingLesson = ref(null);
const lessonForm = ref({
  title: "",
  content: "",
  lesson_order: 0,
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
    fetchCourse();
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

async function fetchCourse() {
  if (!userId.value || !route.params.id) return;

  try {
    loading.value = true;
    const response = await api.getCourse(userId.value, route.params.id);
    course.value = response.data;
    lessons.value = response.data.lessons || [];
  } catch (error) {
    console.error("Error fetching course:", error);
    course.value = {};
    lessons.value = [];
  } finally {
    loading.value = false;
  }
}

function openCreateLessonModal() {
  editingLesson.value = null;
  lessonForm.value = {
    title: "",
    content: "",
    lesson_order: lessons.value.length,
  };
  showLessonModal.value = true;
}

function openEditLessonModal(lesson) {
  editingLesson.value = lesson;
  lessonForm.value = {
    title: lesson.title,
    content: lesson.content || "",
    lesson_order: lesson.lesson_order || 0,
  };
  showLessonModal.value = true;
}

function closeLessonModal() {
  showLessonModal.value = false;
  editingLesson.value = null;
  lessonForm.value = {
    title: "",
    content: "",
    lesson_order: 0,
  };
}

async function saveLesson() {
  if (!course.value.id || !lessonForm.value.title.trim()) return;

  try {
    if (editingLesson.value) {
      // Update existing lesson
      await api.updateLesson(editingLesson.value.id, lessonForm.value);
      // Update local state
      const index = lessons.value.findIndex(
        (l) => l.id === editingLesson.value.id
      );
      if (index !== -1) {
        lessons.value[index] = { ...lessons.value[index], ...lessonForm.value };
      }
      alert("Lesson updated successfully!");
    } else {
      // Create new lesson
      const response = await api.addLesson({
        course_id: course.value.id,
        ...lessonForm.value,
      });
      lessons.value.push(response.data);
      alert("Lesson created successfully!");
    }
    closeLessonModal();
  } catch (error) {
    console.error("Error saving lesson:", error);
    alert("Failed to save lesson. Please try again.");
  }
}

async function deleteLesson(lessonId) {
  if (!confirm("Are you sure you want to delete this lesson?")) {
    return;
  }

  try {
    await api.deleteLesson(lessonId);
    lessons.value = lessons.value.filter((l) => l.id !== lessonId);
    alert("Lesson deleted successfully!");
  } catch (error) {
    console.error("Error deleting lesson:", error);
    alert("Failed to delete lesson. Please try again.");
  }
}

function viewLesson(lessonId) {
  router.push(`/learning/${course.value.id}/lesson/${lessonId}`);
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
