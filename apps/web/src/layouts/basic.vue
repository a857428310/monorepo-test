<template>
  <div class="flex gap-2">
    <div class="flex flex-col gap-2 p-2">
      <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
      <router-link :to="{ name: 'Login' }">Login</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
