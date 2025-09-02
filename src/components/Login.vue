<template>
  <div
    :class="[
      'min-h-screen flex items-center justify-center p-6 transition-colors duration-300',
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800',
    ]"
  >
    <div
      :class="[
        'w-full max-w-md rounded-lg shadow-lg p-8 transition-colors duration-300',
        isDark ? 'bg-gray-800' : 'bg-white',
      ]"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
        <p :class="[isDark ? 'text-gray-400' : 'text-gray-600']">
          Sign in to your dashboard
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label
            for="email"
            :class="[
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700',
            ]"
          >
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            :class="[
              'w-full px-3 py-2 border rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark
                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500',
            ]"
          />
        </div>

        <div>
          <label
            for="password"
            :class="[
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700',
            ]"
          >
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            :class="[
              'w-full px-3 py-2 border rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark
                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500',
            ]"
          />
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          :class="[
            'w-full py-2 px-4 rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white',
          ]"
        >
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>
      </form>

      <div class="mt-6 text-center space-y-2">
        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
          Enter your registered email address
        </p>
        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
          Don't have an account?
          <router-link
            to="/register"
            :class="[
              'font-medium hover:underline transition-colors',
              isDark
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-500',
            ]"
          >
            Sign up here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import databaseService from "../services/databaseService";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const isDark = ref(false);

// Load theme preference
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await databaseService.login({
      email: email.value,
    });

    // Set authentication state
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email.value);
    localStorage.setItem("userId", response.data.id);
    localStorage.setItem("userName", response.data.name);

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "Login failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
