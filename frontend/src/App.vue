<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  createPreferences,
  deletePreferences,
  getPreferences,
  login,
  logout,
  updatePreferences,
} from "./services/api";

const timezoneOptions = Intl.supportedValuesOf("timeZone");
const languageOptions = [
  { value: "en", label: "English" },
  { value: "pt", label: "Portuguese" },
  { value: "es", label: "Spanish" },
];
const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

function createDefaultPreferences() {
  return {
    theme: "system",
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    emailNotifications: true,
    pushNotifications: false,
    marketingOptIn: false,
  };
}

function normalizePreferences(values = {}) {
  const defaults = createDefaultPreferences();

  return {
    theme: values.theme ?? defaults.theme,
    language: values.language ?? defaults.language,
    timezone: values.timezone ?? defaults.timezone,
    emailNotifications: values.emailNotifications ?? defaults.emailNotifications,
    pushNotifications: values.pushNotifications ?? defaults.pushNotifications,
    marketingOptIn: values.marketingOptIn ?? defaults.marketingOptIn,
  };
}

const loginForm = reactive({
  email: "",
  password: "",
});

const preferencesForm = reactive(createDefaultPreferences());

const isAuthenticated = ref(false);
const hasStoredPreferences = ref(false);
const isLoadingSession = ref(true);
const isSubmittingLogin = ref(false);
const isSavingPreferences = ref(false);
const isDeletingPreferences = ref(false);
const isCreatingPreferences = ref(false);
const feedback = ref("");
const feedbackTone = ref("neutral");

const welcomeMessage = computed(() => {
  if (!isAuthenticated.value) {
    return "Log in to create or update your saved preferences.";
  }

  return hasStoredPreferences.value
    ? "Your preferences are loaded and ready to update."
    : "You are logged in. Save your preferences to create your first profile.";
});

const shouldShowPreferencesForm = computed(
  () => isAuthenticated.value && (hasStoredPreferences.value || isCreatingPreferences.value)
);

function setFeedback(message, tone = "neutral") {
  feedback.value = message;
  feedbackTone.value = tone;
}

function resetPreferencesForm(values = createDefaultPreferences()) {
  Object.assign(preferencesForm, normalizePreferences(values));
}

async function loadPreferences() {
  try {
    const data = await getPreferences();
    resetPreferencesForm({
      theme: data.theme,
      language: data.language,
      timezone: data.timezone,
      emailNotifications: data.emailNotifications,
      pushNotifications: data.pushNotifications,
      marketingOptIn: data.marketingOptIn,
    });
    isAuthenticated.value = true;
    hasStoredPreferences.value = true;
    setFeedback("Preferences loaded successfully.", "success");
  } catch (error) {
    if (error.status === 404) {
      isAuthenticated.value = true;
      hasStoredPreferences.value = false;
      isCreatingPreferences.value = false;
      resetPreferencesForm();
      setFeedback("No preferences found yet.", "neutral");
      return;
    }

    if (error.status === 401) {
      isAuthenticated.value = false;
      hasStoredPreferences.value = false;
      isCreatingPreferences.value = false;
      setFeedback("Log in to manage your preferences.", "neutral");
      return;
    }

    throw error;
  }
}

async function handleLogin() {
  isSubmittingLogin.value = true;
  setFeedback("Signing you in...", "neutral");

  try {
    await login(loginForm);
    loginForm.password = "";
    await loadPreferences();
    setFeedback("Login successful. Your session is ready.", "success");
  } catch (error) {
    setFeedback(error.message, "error");
  } finally {
    isSubmittingLogin.value = false;
  }
}

async function handleSavePreferences() {
  isSavingPreferences.value = true;
  setFeedback(
    hasStoredPreferences.value ? "Updating preferences..." : "Saving preferences...",
    "neutral"
  );

  try {
    const request = hasStoredPreferences.value ? updatePreferences : createPreferences;
    const response = await request({ ...preferencesForm });
    const savedPreferences = normalizePreferences(response.preferences || preferencesForm);
    resetPreferencesForm(savedPreferences);
    hasStoredPreferences.value = true;
    isCreatingPreferences.value = false;
    setFeedback(response.message || "Preferences saved successfully.", "success");
  } catch (error) {
    if (error.status === 401) {
      isAuthenticated.value = false;
      hasStoredPreferences.value = false;
      isCreatingPreferences.value = false;
    }
    setFeedback(error.message, "error");
  } finally {
    isSavingPreferences.value = false;
  }
}

async function handleDeletePreferences() {
  isDeletingPreferences.value = true;
  setFeedback("Removing preferences...", "neutral");

  try {
    const response = await deletePreferences();
    hasStoredPreferences.value = false;
    isCreatingPreferences.value = false;
    resetPreferencesForm();
    setFeedback(response.message || "Preferences deleted successfully.", "success");
  } catch (error) {
    if (error.status === 401) {
      isAuthenticated.value = false;
      hasStoredPreferences.value = false;
      isCreatingPreferences.value = false;
    }
    setFeedback(error.message, "error");
  } finally {
    isDeletingPreferences.value = false;
  }
}

async function handleLogout() {
  try {
    await logout();
  } catch (error) {
    // Reset the client state even if the backend cookie is already gone.
  }

  isAuthenticated.value = false;
  hasStoredPreferences.value = false;
  isCreatingPreferences.value = false;
  loginForm.password = "";
  resetPreferencesForm();
  setFeedback("You have been logged out.", "neutral");
}

function handleStartCreatingPreferences() {
  isCreatingPreferences.value = true;
  resetPreferencesForm();
  setFeedback("Fill the form to create your preferences.", "neutral");
}

onMounted(async () => {
  try {
    await loadPreferences();
  } catch (error) {
    setFeedback(error.message, "error");
  } finally {
    isLoadingSession.value = false;
  }
});
</script>

<template>
  <div class="page-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">Capstone Frontend</p>
        <h1>Preferences</h1>
      </div>
      <button
        v-if="isAuthenticated"
        class="ghost-button"
        type="button"
        @click="handleLogout"
      >
        Logout
      </button>
    </header>

    <main class="app-shell">
      <section class="workspace-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">API workspace</p>
          <h2>{{ isAuthenticated ? "Preferences" : "Login" }}</h2>
        </div>
        <p class="session-copy">
          {{ isLoadingSession ? "Checking active session..." : welcomeMessage }}
        </p>
      </div>

      <p class="feedback" :data-tone="feedbackTone">{{ feedback }}</p>

      <form v-if="!isAuthenticated" class="stack" @submit.prevent="handleLogin">
        <label class="field">
          <span>Email</span>
          <input v-model.trim="loginForm.email" type="email" required placeholder="you@example.com" />
        </label>

        <label class="field">
          <span>Password</span>
          <input
            v-model="loginForm.password"
            type="password"
            required
            minlength="6"
            placeholder="Enter your password"
          />
        </label>

        <button class="primary-button" type="submit" :disabled="isSubmittingLogin">
          {{ isSubmittingLogin ? "Signing in..." : "Login" }}
        </button>
      </form>

      <div v-else-if="!shouldShowPreferencesForm" class="empty-state">
        <p class="empty-state-copy">
          You do not have preferences saved yet.
        </p>
        <button class="primary-button" type="button" @click="handleStartCreatingPreferences">
          Create preferences
        </button>
      </div>

      <form v-else class="stack" @submit.prevent="handleSavePreferences">
        <div class="field-grid">
          <label class="field">
            <span>Theme</span>
            <select v-model="preferencesForm.theme">
              <option v-for="option in themeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Language</span>
            <select v-model="preferencesForm.language">
              <option
                v-for="option in languageOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>

        <label class="field">
          <span>Timezone</span>
          <select v-model="preferencesForm.timezone">
            <option v-for="timezone in timezoneOptions" :key="timezone" :value="timezone">
              {{ timezone }}
            </option>
          </select>
        </label>

        <div class="toggle-list">
          <label class="toggle-card">
            <input v-model="preferencesForm.emailNotifications" type="checkbox" />
            <div>
              <strong>Email notifications</strong>
              <span>Receive updates by email when important changes happen.</span>
            </div>
          </label>

          <label class="toggle-card">
            <input v-model="preferencesForm.pushNotifications" type="checkbox" />
            <div>
              <strong>Push notifications</strong>
              <span>Enable real-time alerts for faster follow-up.</span>
            </div>
          </label>

          <label class="toggle-card">
            <input v-model="preferencesForm.marketingOptIn" type="checkbox" />
            <div>
              <strong>Marketing opt-in</strong>
              <span>Allow product news and early feature announcements.</span>
            </div>
          </label>
        </div>

        <div class="action-row">
          <button class="primary-button" type="submit" :disabled="isSavingPreferences">
            {{
              isSavingPreferences
                ? "Saving..."
                : hasStoredPreferences
                  ? "Update preferences"
                  : "Save preferences"
            }}
          </button>

          <button
            v-if="!hasStoredPreferences"
            class="secondary-button"
            type="button"
            @click="isCreatingPreferences = false"
          >
            Cancel
          </button>

          <button class="secondary-button" type="button" @click="loadPreferences">
            Refresh
          </button>

          <button
            class="ghost-button danger"
            type="button"
            :disabled="!hasStoredPreferences || isDeletingPreferences"
            @click="handleDeletePreferences"
          >
            {{ isDeletingPreferences ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </form>
      </section>
    </main>
  </div>
</template>
