<template>
  <div
    :class="[
      'min-h-screen p-6 transition-colors duration-300',
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800',
    ]"
  >
    <!-- Header with Theme Toggle -->
    <header class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Personal Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Welcome back, {{ userName }}!
        </p>
      </div>

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
                'flex-1 rounded-l-lg px-3 py-2 transition-colors duration-300',
                isDark
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'border bg-white',
              ]"
            />
            <button
              @click="addTask"
              class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              Add
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
        <h2 class="text-xl font-semibold mb-4">Weather</h2>
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
import {
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/vue/24/outline";
import api from "../services/api";

const userId = ref(1); // Default user ID - in a real app, this would come from authentication
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

  // Fetch data from API
  fetchData();

  // Generate initial calendar
  generateCalendarDays();
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
    !newEvent.value.event_time
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

    const response = await api.addEvent(eventData);
    events.value.unshift(response.data);

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
  try {
    loading.value = true;

    // Fetch user data
    const userResponse = await api.getUser(userId.value);
    userName.value = userResponse.data.name || "User";

    // Fetch tasks
    const tasksResponse = await api.getTasks(userId.value);
    tasks.value = tasksResponse.data;

    // Fetch events
    const eventsResponse = await api.getEvents(userId.value);
    events.value = eventsResponse.data;

    // Fetch stats
    const statsResponse = await api.getStats(userId.value);
    stats.value = statsResponse.data;

    // Fetch notes
    const notesResponse = await api.getNotes(userId.value);
    note.value = notesResponse.data.content || "";
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

async function addTask() {
  if (newTask.value.trim()) {
    try {
      const response = await api.addTask({
        user_id: userId.value,
        text: newTask.value.trim(),
      });
      tasks.value.unshift(response.data);
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
  try {
    await api.updateTask(task.id, {
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
  try {
    await api.deleteTask(id);
    tasks.value = tasks.value.filter((task) => task.id !== id);
  } catch (error) {
    console.error("Error deleting task:", error);
    // Fallback: remove from local state
    tasks.value = tasks.value.filter((task) => task.id !== id);
  }
}

async function saveNote() {
  try {
    await api.saveNote({
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
