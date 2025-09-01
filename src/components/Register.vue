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
        <h1 class="text-3xl font-bold mb-2">Create Account</h1>
        <p :class="[isDark ? 'text-gray-400' : 'text-gray-600']">
          Join us and start managing your tasks
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label
            for="name"
            :class="[
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700',
            ]"
          >
            Full Name
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="Enter your full name"
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

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="text-green-500 text-sm text-center">
          {{ successMessage }}
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
          {{ loading ? "Creating Account..." : "Create Account" }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
          Already have an account?
          <router-link
            to="/login"
            :class="[
              'font-medium hover:underline transition-colors',
              isDark
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-500',
            ]"
          >
            Sign in here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const name = ref("");
const email = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
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

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await api.register({
      name: name.value,
      email: email.value,
    });

    successMessage.value =
      "Account created successfully! Redirecting to login...";

    // Clear form
    name.value = "";
    email.value = "";

    // Redirect to login after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "Registration failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
