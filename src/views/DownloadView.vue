<script setup>
const lguSeal = '/favicon.ico'

// Update these on every release
const APK_URL = '/downloads/LeaveSync.apk'
const APK_VERSION = '1.0.0'
const RELEASED = 'October 2026'

const steps = [
  {
    title: 'Download the APK',
    body: 'Tap Download APK below. If your browser warns about the file, tap Download anyway.',
  },
  {
    title: 'Allow installation',
    body: 'Open the file. If Android blocks it, tap Settings, turn on "Allow from this source", then go back.',
  },
  {
    title: 'Install',
    body: 'Tap Install. If Play Protect warns you, tap More details, then Install anyway.',
  },
  {
    title: 'Log in',
    body: 'Open LeaveSync and sign in with the account given by HR. A one-time code will be sent to your email.',
  },
]
</script>

<template>
  <div
    class="min-h-screen bg-white text-slate-800"
    style="font-family: Manrope, system-ui, sans-serif"
  >
    <!-- Header -->
    <header class="bg-blue-900 text-white">
      <div class="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
        <img
          :src="lguSeal"
          alt="LGU Echague seal"
          class="h-10 w-10 rounded-full bg-white object-contain"
        />
        <div class="leading-tight">
          <p class="text-lg font-bold">LeaveSync</p>
          <!-- <p class="text-xs text-blue-200">Municipality of Echague, Isabela</p> -->
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-5 py-12">
      <!-- Intro -->
      <!-- <h1 class="text-3xl font-bold leading-tight text-blue-900 md:text-4xl">
        LeaveSync mobile app
      </h1> -->
      <!-- About -->
      <h2 class="text-xl font-bold text-blue-900">About</h2>
      <p class="mt-3 text-lg leading-relaxed text-slate-700 md:text-xl">
        LeaveSync is a leave management system. Use the app to file leave applications, check your
        leave credits, and track the status of your applications.
      </p>

      <!-- Steps -->
      <h2 class="mt-10 text-xl font-bold text-blue-900">How to install</h2>
      <ol class="mt-5 space-y-5">
        <li v-for="(step, i) in steps" :key="step.title" class="flex gap-4">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800"
          >
            {{ i + 1 }}
          </span>
          <div>
            <h3 class="font-semibold text-slate-900">{{ step.title }}</h3>
            <p class="mt-0.5 text-sm leading-relaxed text-slate-600">{{ step.body }}</p>
          </div>
        </li>
      </ol>

      <!-- Download -->
      <div class="mt-12 border-t border-slate-200 pt-10 text-center">
        <a
          :href="APK_URL"
          download
          class="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 text-base font-semibold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14"
            />
          </svg>
          Download APK
        </a>
        <p class="mt-3 text-sm text-slate-500">
          Version {{ APK_VERSION }} · Released {{ RELEASED }}
        </p>
        <p class="mt-1 text-sm text-slate-500">For login problems, visit the MHRMO.</p>
      </div>
    </main>
  </div>
</template>