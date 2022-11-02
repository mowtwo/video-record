<script lang="ts" setup>
import Video from "./Video.vue";
</script>

<template>
  <TabView>
    <TabPanel header="查看视频">
      <Video></Video>
    </TabPanel>
  </TabView>
</template>

<style lang="scss" scoped>
.p-tabview {
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  :deep(.p-tabview-panels) {
    flex: 1;
    overflow: hidden;
    padding: 0.2rem 0.1rem;
  }
  :deep(.p-tabview-panel) {
    height: 100%;
  }
}
</style>
