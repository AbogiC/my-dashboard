<template>
  <div
    :class="[
      'min-h-screen p-6 transition-colors duration-300',
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800',
    ]"
  >
    <!-- Header with Theme Toggle and Logout -->
    <header class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Personal Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Welcome back, {{ userName }}!
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

        <!-- Learning Button -->
        <button
          @click="$router.push('/learning')"
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            ></path>
          </svg>
          <span class="hidden sm:inline">Learning</span>
        </button>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          :class="[
            'px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2',
            isDark
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white',
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          <span class="hidden sm:inline">Logout</span>
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
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.title"
          :class="[
            'rounded-lg shadow p-6 transition-colors duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <div class="flex items-center">
            <div :class="['p-3 rounded-full', stat.bgColor]">
              <component
                :is="getIconComponent(stat.icon)"
                class="w-6 h-6 text-white"
              />
            </div>
            <div class="ml-4">
              <p
                :class="[
                  'text-sm font-medium',
                  isDark ? 'text-gray-400' : 'text-gray-600',
                ]"
              >
                {{ stat.title }}
              </p>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Todo List -->
        <div
          :class="[
            'lg:col-span-1 rounded-lg shadow p-6 transition-colors duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <h2 class="text-xl font-semibold mb-4">Tasks</h2>
          <div class="space-y-3">
            <div
              v-for="task in tasks"
              :key="task.id"
              :class="[
                'flex items-center justify-between p-3 rounded-lg transition-colors duration-300',
                isDark ? 'bg-gray-700 border-gray-600' : 'border bg-white',
              ]"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  @change="toggleTaskCompletion(task)"
                  class="mr-3 h-5 w-5 text-blue-600"
                />
                <span
                  :class="{
                    'line-through': task.completed,
                    'text-gray-400': task.completed && !isDark,
                    'text-gray-500': task.completed && isDark,
                  }"
                >
                  {{ task.text }}
                </span>
              </div>
              <button
                @click="removeTask(task.id)"
                class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="mt-4 flex">
            <input
              v-model="newTask"
              @keyup.enter="addTask"
              placeholder="Add new task..."
              :class="[
                'flex-1 rounded-l-lg px-2 sm:px-3 py-2 transition-colors duration-300',
                isDark
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'border bg-white',
              ]"
            />
            <button
              @click="addTask"
              class="bg-blue-500 text-white px-2 sm:px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 sm:mr-2"
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
              <span class="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        <!-- Calendar -->
        <div
          :class="[
            'lg:col-span-1 rounded-lg shadow p-6 transition-colors duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Calendar</h2>
            <div class="flex space-x-2">
              <button
                @click="previousMonth"
                :class="[
                  'p-1 rounded hover:bg-opacity-80 transition-colors',
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
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
              </button>
              <button
                @click="nextMonth"
                :class="[
                  'p-1 rounded hover:bg-opacity-80 transition-colors',
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
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
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Month/Year Display -->
          <div class="text-center mb-4">
            <h3 class="text-lg font-medium">{{ currentMonthYear }}</h3>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 mb-4">
            <!-- Day Headers -->
            <div
              v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="day"
              :class="[
                'text-center text-xs font-medium py-2',
                isDark ? 'text-gray-400' : 'text-gray-500',
              ]"
            >
              {{ day }}
            </div>

            <!-- Calendar Days -->
            <div
              v-for="day in calendarDays"
              :key="day.date"
              :class="[
                'relative p-2 text-center text-sm cursor-pointer rounded transition-colors',
                day.isCurrentMonth
                  ? isDark
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                  : isDark
                  ? 'text-gray-600'
                  : 'text-gray-400',
                day.isToday ? 'bg-blue-500 text-white font-semibold' : '',
                day.hasEvents ? 'font-semibold' : '',
              ]"
              @click="selectDate(day)"
            >
              {{ day.dayNumber }}
              <!-- Event Indicator -->
              <div
                v-if="day.hasEvents"
                :class="[
                  'absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full',
                  day.isToday ? 'bg-white' : 'bg-blue-500',
                ]"
              ></div>
            </div>
          </div>

          <!-- Selected Date Events -->
          <div v-if="selectedDateEvents.length > 0" class="mt-4">
            <h4 class="text-sm font-medium mb-2">
              Events on {{ formatSelectedDate(selectedDate) }}
            </h4>
            <div class="space-y-2">
              <div
                v-for="event in selectedDateEvents"
                :key="event.id"
                :class="[
                  'p-2 text-xs rounded transition-colors duration-300',
                  isDark
                    ? 'bg-blue-900 border-blue-500'
                    : 'bg-blue-50 border-blue-500',
                ]"
              >
                <p class="font-medium">{{ event.title }}</p>
                <p
                  :class="[
                    'text-xs',
                    isDark ? 'text-blue-200' : 'text-gray-600',
                  ]"
                >
                  {{ formatTime(event.event_time) }}
                </p>
                <p
                  v-if="event.description"
                  :class="[
                    'text-xs mt-1',
                    isDark ? 'text-blue-300' : 'text-gray-500',
                  ]"
                >
                  {{ event.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Add Event Button -->
          <div class="mt-4">
            <button
              @click="openAddEventModal"
              :class="[
                'w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300',
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
              ]"
            >
              + Add Event
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div
          :class="[
            'lg:col-span-1 rounded-lg shadow p-6 transition-colors duration-300',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <h2 class="text-xl font-semibold mb-4">Quick Notes</h2>
          <textarea
            v-model="note"
            placeholder="Write your notes here..."
            :class="[
              'w-full h-32 rounded-lg p-3 mb-3 resize-none transition-colors duration-300',
              isDark
                ? 'bg-gray-700 text-white border-gray-600'
                : 'border bg-white',
            ]"
          ></textarea>
          <button
            @click="saveNote"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>

      <!-- Weather Widget -->
      <div
        :class="[
          'mt-6 rounded-lg shadow p-6 transition-colors duration-300',
          isDark ? 'bg-gray-800' : 'bg-white',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Weather</h2>
          <button
            @click="fetchWeather"
            :class="[
              'p-2 rounded-full transition-colors duration-300',
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
            ]"
            :aria-label="'Refresh weather'"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-3xl font-bold">{{ weather.temperature }}°C</p>
            <p :class="[isDark ? 'text-gray-400' : 'text-gray-600']">
              {{ weather.condition }}
            </p>
            <p :class="['text-sm', isDark ? 'text-gray-500' : 'text-gray-500']">
              {{ weather.location }}
            </p>
          </div>
          <div class="text-4xl">
            {{ weather.emoji }}
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Modal -->
    <div
      v-if="showAddEventModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeAddEventModal"
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
          <h3 class="text-lg font-semibold">Add New Event</h3>
          <button
            @click="closeAddEventModal"
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
          <form @submit.prevent="addEvent">
            <!-- Event Title -->
            <div class="mb-4">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Event Title
              </label>
              <input
                v-model="newEvent.title"
                type="text"
                required
                placeholder="Enter event title..."
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
                ]"
              />
            </div>

            <!-- Event Date -->
            <div class="mb-4">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Event Date
              </label>
              <input
                v-model="newEvent.event_date"
                type="date"
                required
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
                ]"
              />
            </div>

            <!-- Event Time -->
            <div class="mb-4">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Event Time
              </label>
              <input
                v-model="newEvent.event_time"
                type="time"
                required
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
                ]"
              />
            </div>

            <!-- Event Description (Optional) -->
            <div class="mb-6">
              <label
                :class="[
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                Description (Optional)
              </label>
              <textarea
                v-model="newEvent.description"
                rows="3"
                placeholder="Enter event description..."
                :class="[
                  'w-full px-3 py-2 border rounded-lg transition-colors duration-300 resize-none',
                  isDark
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
                ]"
              ></textarea>

              <!-- Description Preview -->
              <div
                v-if="newEvent.description"
                :class="[
                  'mt-2 p-2 rounded text-xs',
                  isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600',
                ]"
              >
                <span class="font-medium">Preview:</span>
                {{ newEvent.description }}
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex space-x-3">
              <button
                type="button"
                @click="closeAddEventModal"
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
                :disabled="
                  !newEvent.title ||
                  !newEvent.event_date ||
                  !newEvent.event_time
                "
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import {
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/vue/24/outline";
import databaseService from "../services/databaseService";

const router = useRouter();

const userId = ref(null);
const userName = ref("");
const newTask = ref("");
const note = ref("");
const isDark = ref(false);
const loading = ref(true);

// Data from API
const tasks = ref([]);
const events = ref([]);
const stats = ref([]);
const weather = ref({
  temperature: 22,
  condition: "Partly Cloudy",
  location: "New York, NY",
  emoji: "☀️",
});

// Calendar state
const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const calendarDays = ref([]);
const selectedDateEvents = ref([]);

// Modal state
const showAddEventModal = ref(false);
const newEvent = ref({
  title: "",
  event_date: "",
  event_time: "",
  description: "",
});

// Load theme preference from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    // Check system preference
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  applyTheme();

  // Get user data from localStorage
  const storedUserId = localStorage.getItem("userId");
  const storedUserName = localStorage.getItem("userName");

  if (storedUserId) {
    userId.value = storedUserId;
  }
  if (storedUserName) {
    userName.value = storedUserName;
  }

  // Fetch data from API
  fetchData();

  // Fetch weather data
  fetchWeather();

  // Generate initial calendar
  generateCalendarDays();

  // Add logs for debugging responsiveness
  console.log("Initial window width:", window.innerWidth);
  window.addEventListener("resize", () => {
    console.log("Window resized to:", window.innerWidth);
    // Check if action buttons container is overflowing
    const actionButtons = document.querySelector(
      ".flex.items-center.space-x-2"
    );
    if (actionButtons) {
      const containerWidth = actionButtons.offsetWidth;
      const scrollWidth = actionButtons.scrollWidth;
      console.log(
        "Action buttons container width:",
        containerWidth,
        "Scroll width:",
        scrollWidth
      );
      if (scrollWidth > containerWidth) {
        console.log("Action buttons are overflowing!");
      }
    }
    // Check if task input section is overflowing
    const taskInputSection = document.querySelector(".mt-4.flex");
    if (taskInputSection) {
      const containerWidth = taskInputSection.offsetWidth;
      const scrollWidth = taskInputSection.scrollWidth;
      console.log(
        "Task input section container width:",
        containerWidth,
        "Scroll width:",
        scrollWidth
      );
      if (scrollWidth > containerWidth) {
        console.log("Task input section is overflowing!");
      }
    }
  });
});

// Watch for theme changes
watch(isDark, (newValue) => {
  localStorage.setItem("theme", newValue ? "dark" : "light");
  applyTheme();
});

// Watch for events changes to update calendar
watch(
  events,
  () => {
    generateCalendarDays();
    updateSelectedDateEvents();
  },
  { deep: true }
);

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme() {
  isDark.value = !isDark.value;
}

function handleLogout() {
  // Clear authentication data
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");

  // Redirect to login
  router.push("/login");
}

// Format time for display
function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Get icon component by name
function getIconComponent(iconName) {
  const icons = {
    ChartBarIcon,
    CalendarIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
  };
  return icons[iconName] || ChartBarIcon;
}

// Calendar functions
function generateCalendarDays() {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const today = new Date();

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isCurrentMonth = date.getMonth() === month;
    const isToday = date.toDateString() === today.toDateString();
    const hasEvents = checkForEvents(date);

    days.push({
      date: date.toISOString(),
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday,
      hasEvents,
    });
  }

  calendarDays.value = days;
}

function checkForEvents(date) {
  return events.value.some((event) => {
    const eventDate = new Date(event.event_date);
    return eventDate.toDateString() === date.toDateString();
  });
}

function previousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
  generateCalendarDays();
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
  generateCalendarDays();
}

function selectDate(day) {
  if (day.isCurrentMonth) {
    selectedDate.value = new Date(day.date);
    updateSelectedDateEvents();
  }
}

function updateSelectedDateEvents() {
  selectedDateEvents.value = events.value.filter((event) => {
    const eventDate = new Date(event.event_date);
    return eventDate.toDateString() === selectedDate.value.toDateString();
  });
}

function formatSelectedDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Computed properties for calendar
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

// Modal functions
function openAddEventModal() {
  // Pre-fill the date with the selected date from calendar
  newEvent.value.event_date = selectedDate.value.toISOString().split("T")[0];
  newEvent.value.event_time = "";
  newEvent.value.title = "";
  newEvent.value.description = "";
  showAddEventModal.value = true;
}

function closeAddEventModal() {
  showAddEventModal.value = false;
  // Reset form
  newEvent.value = {
    title: "",
    event_date: "",
    event_time: "",
    description: "",
  };
}

async function addEvent() {
  if (
    !newEvent.value.title ||
    !newEvent.value.event_date ||
    !newEvent.value.event_time ||
    !userId.value
  ) {
    return;
  }

  try {
    const eventData = {
      user_id: userId.value,
      title: newEvent.value.title,
      event_date: newEvent.value.event_date,
      event_time: newEvent.value.event_time,
      description: newEvent.value.description || null,
    };

    const response = await databaseService.addEvent(eventData);
    events.value.unshift(response);

    // Close modal and show success message
    closeAddEventModal();
    alert("Event added successfully!");

    // Update calendar to show the new event
    generateCalendarDays();
    updateSelectedDateEvents();
  } catch (error) {
    console.error("Error adding event:", error);

    // Fallback: add to local state
    const fallbackEvent = {
      id: Date.now(),
      user_id: userId.value,
      title: newEvent.value.title,
      event_date: newEvent.value.event_date,
      event_time: newEvent.value.event_time,
      description: newEvent.value.description || null,
    };

    events.value.unshift(fallbackEvent);
    closeAddEventModal();
    alert("Event added successfully! (offline mode)");

    // Update calendar
    generateCalendarDays();
    updateSelectedDateEvents();
  }
}

// Fetch all data from API
async function fetchData() {
  if (!userId.value) {
    console.error("No user ID available");
    loading.value = false;
    return;
  }

  try {
    loading.value = true;

    // Fetch user data
    const userResponse = await databaseService.getUser(userId.value);
    userName.value = userResponse.name || "User";

    // Fetch tasks
    const tasksResponse = await databaseService.getTasks(userId.value);
    tasks.value = tasksResponse;

    // Fetch events
    const eventsResponse = await databaseService.getEvents(userId.value);
    events.value = eventsResponse;

    // Fetch stats
    const statsResponse = await databaseService.getStats(userId.value);
    stats.value = statsResponse;

    // Fetch notes
    const notesResponse = await databaseService.getNotes(userId.value);
    note.value = notesResponse ? notesResponse.content || "" : "";
  } catch (error) {
    console.error("Error fetching data:", error);
    // Fallback data if API is not available
    tasks.value = [
      { id: 1, text: "Complete project proposal", completed: false },
      { id: 2, text: "Meeting with team", completed: false },
      { id: 3, text: "Review documents", completed: true },
    ];

    stats.value = [
      {
        title: "Tasks Completed",
        value: "12/20",
        icon: "ChartBarIcon",
        bgColor: "bg-blue-500",
      },
      {
        title: "Meetings Today",
        value: "3",
        icon: "CalendarIcon",
        bgColor: "bg-green-500",
      },
      {
        title: "Team Members",
        value: "8",
        icon: "UserGroupIcon",
        bgColor: "bg-purple-500",
      },
      {
        title: "Revenue",
        value: "$4,200",
        icon: "CurrencyDollarIcon",
        bgColor: "bg-orange-500",
      },
    ];

    events.value = [
      {
        id: 1,
        title: "Team Standup",
        event_time: "10:00:00",
        event_date: new Date().toISOString().split("T")[0],
      },
      {
        id: 2,
        title: "Client Meeting",
        event_time: "14:00:00",
        event_date: new Date().toISOString().split("T")[0],
      },
      {
        id: 3,
        title: "Project Review",
        event_time: "16:30:00",
        event_date: new Date().toISOString().split("T")[0],
      },
    ];
  } finally {
    loading.value = false;
  }
}

// Fetch real-time weather data from WeatherAPI.com
async function fetchWeather() {
  const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
  if (!apiKey || apiKey === "your_weatherapi_key_here") {
    console.warn("Weather API key not configured");
    return;
  }

  try {
    const city = "Jakarta"; // Default city, can be made configurable
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`);
    }

    const data = await response.json();

    // Get current weather data
    const current = data.current;
    const location = data.location;

    // Map weather condition to emoji
    const conditionText = current.condition.text.toLowerCase();
    let emoji = "☀️"; // default

    if (conditionText.includes("rain") || conditionText.includes("drizzle")) {
      emoji = "🌧️";
    } else if (conditionText.includes("snow")) {
      emoji = "❄️";
    } else if (conditionText.includes("cloud")) {
      if (conditionText.includes("partly")) {
        emoji = "⛅";
      } else {
        emoji = "☁️";
      }
    } else if (
      conditionText.includes("clear") ||
      conditionText.includes("sunny")
    ) {
      emoji = "☀️";
    } else if (
      conditionText.includes("thunder") ||
      conditionText.includes("storm")
    ) {
      emoji = "⛈️";
    } else if (
      conditionText.includes("mist") ||
      conditionText.includes("fog")
    ) {
      emoji = "🌫️";
    }

    weather.value = {
      temperature: Math.round(current.temp_c),
      condition: current.condition.text,
      location: `${location.name}, ${location.country}`,
      emoji: emoji,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    // Keep existing static data as fallback
  }
}

async function addTask() {
  if (newTask.value.trim() && userId.value) {
    try {
      const response = await databaseService.addTask({
        user_id: userId.value,
        text: newTask.value.trim(),
      });
      tasks.value.unshift(response);
      newTask.value = "";
    } catch (error) {
      console.error("Error adding task:", error);
      // Fallback: add to local state
      tasks.value.unshift({
        id: Date.now(),
        text: newTask.value.trim(),
        completed: false,
        user_id: userId.value,
      });
      newTask.value = "";
    }
  }
}

async function toggleTaskCompletion(task) {
  if (!userId.value) return;

  try {
    await databaseService.updateTask(task.id, {
      text: task.text,
      completed: !task.completed,
    });
    task.completed = !task.completed;
  } catch (error) {
    console.error("Error updating task:", error);
    // Revert the change on error
    task.completed = !task.completed;
  }
}

async function removeTask(id) {
  if (!userId.value) return;

  try {
    await databaseService.deleteTask(id);
    tasks.value = tasks.value.filter((task) => task.id !== id);
  } catch (error) {
    console.error("Error deleting task:", error);
    // Fallback: remove from local state
    tasks.value = tasks.value.filter((task) => task.id !== id);
  }
}

async function saveNote() {
  if (!userId.value) return;

  try {
    await databaseService.saveNote({
      user_id: userId.value,
      content: note.value,
    });
    alert("Note saved successfully!");
  } catch (error) {
    console.error("Error saving note:", error);
    alert("Failed to save note. Please try again.");
  }
}
</script>
