<template>
  <div>
    <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
     <!-- 自定义标签名（默认为 <a>） -->
    <router-link to="/dashboard" custom v-slot="{ navigate }">
      <button @click="navigate">跳转到控制台</button>
    </router-link>
  </div>
</template>
