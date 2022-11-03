<script lang="ts" setup>
import { ref, watch } from "vue";
import { cacheVideoList, selected } from "../data/store";
import VideoCard from "../lib/VideoCard.vue";
const videoDataURL = ref("");
const videoRef = ref<HTMLVideoElement>();

const handleClick = async (url: string) => {
  console.log("click");
  videoDataURL.value = url;
};
</script>

<template>
  <Splitter layout="vertical" style="height: 100%" class="video">
    <SplitterPanel :size="70" :min-size="50">
      <Panel :header="selected?.name ?? '暂未选择视频'">
        <div class="preview">
          <video
            v-if="!!videoDataURL"
            :src="videoDataURL"
            controls
            ref="videoRef"
            controlslist="nodownload"
          ></video>
        </div>
      </Panel>
    </SplitterPanel>
    <SplitterPanel :size="30" :min-size="25">
      <Panel header="视频列表">
        <div class="flex gap-1 h-100%">
          <VideoCard
            v-for="item of cacheVideoList"
            :key="item.name"
            :item="item"
            @click="handleClick"
          ></VideoCard>
        </div>
      </Panel>
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
  overflow: hidden;
  position: relative;
}
.preview {
  background-color: #000;
  position: absolute;
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
