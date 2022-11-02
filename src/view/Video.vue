<script lang="ts" setup></script>

<template>
  <Splitter layout="vertical" style="height: 100%">
    <SplitterPanel :size="80" :min-size="60">
      <Panel header="测试视频"></Panel>
    </SplitterPanel>
    <SplitterPanel :size="20" :min-size="15">
      <Panel header="控制面板"></Panel>
    </SplitterPanel>
  </Splitter>
</template>

<style lang="scss" scoped>
:deep(.p-panel) {
  display: flex;
  flex-flow: column;
  height: 100%;
}
:deep(.p-panel .p-toggleable-content) {
  flex: 1;
  overflow: hidden;
}
:deep(.p-panel .p-panel-content) {
  height: 100%;
  overflow-y: auto;
}
</style>
