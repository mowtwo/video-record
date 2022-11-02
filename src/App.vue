<script lang="ts" setup>
import Logo from "./assets/m2-capture.png";
import Github from "./assets/github.png";

const items = [
  {
    label: "文件",
    icon: "pi pi-file",
    items: [
      {
        label: "新建录制",
        icon: "pi pi-video",
      },
      {
        label: "导出视频",
        icon: "pi pi-file-export",
      },
    ],
  },
  {
    label: "帮助",
    icon: "pi pi-info-circle",
    items: [
      {
        label: "关于",
        icon: "pi pi-comment",
      },
    ],
  },
];
</script>

<template>
  <div class="flex flex-col fixed top-0 left-0 w-100% h-100% overflow-hidden">
    <Menubar :model="items">
      <template #start>
        <img class="h-10 mr-2" :src="Logo" alt="Logo" />
      </template>
      <template #end>
        <a href="https://github.com/mowtwo/video-record">
          <img class="h-8" :src="Github" alt="github" />
        </a>
      </template>
    </Menubar>
    <div class="flex-1 main">
      <Splitter style="height: 100%">
        <SplitterPanel :size="15" :min-size="10">
          <Panel header="视频列表" style="height: 100%"> </Panel>
        </SplitterPanel>
        <SplitterPanel :size="85" :min-size="60">
          <RouterView></RouterView>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  :deep(.p-panel) {
    display: flex;
    flex-flow: column;
  }
  :deep(.p-panel .p-toggleable-content) {
    flex: 1;
    overflow: hidden;
  }
  :deep(.p-panel .p-panel-content) {
    height: 100%;
    overflow-y: auto;
  }
  :deep(.p-splitter-panel) {
    overflow: hidden;
  }
}
</style>
