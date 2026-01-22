<script setup lang="ts">
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import 'dayjs/locale/zh-cn'

const locale = computed(() => {
  return navigator.language === 'zh-CN' ? zhCn : en
})
</script>

<template>
  <el-config-provider :locale="locale">
    <div class="h-screen w-screen">
      <router-view/>
    </div>
  </el-config-provider>
</template>

<style scoped lang="less"></style>
