<script lang="ts" setup>
import { ref } from "vue";
import { cacheVideoListMap, selected, VideoItem } from "../data/store";
import convertAsDataURL from "../utils/covertAsDataURL";
import readAsDataURL from "../utils/readAsDataURL";
import { downloadVideo } from "../utils/downloadIt";
import { useToast } from "primevue/usetoast";

const toast = useToast();

let cacheVideo = "";

const props = defineProps<{
  item: VideoItem;
}>();
const emit = defineEmits<{
  (e: "click", dataUrl: string): void;
}>();

const handleClick = async () => {
  if (selected.value === props.item) {
    return;
  }
  selected.value = props.item;
  const file = cacheVideoListMap.get(props.item.key);
  console.log(cacheVideoListMap.has(props.item.key));
  if (file) {
    const url = await readAsDataURL(file);
    emit("click", url);
  }
};

const converting = ref(false);

const handleDownload = async () => {
  if (!!cacheVideo) {
    downloadVideo(cacheVideo, props.item.name + ".mp4");
    return;
  }

  converting.value = true;
  try {
    const file = cacheVideoListMap.get(props.item.key);
    if (!file) {
      throw new Error("下载失败，文件不存在");
    }
    const url = (cacheVideo = await convertAsDataURL(
      file,
      props.item.name + ".mp4"
    ));
    downloadVideo(url, props.item.name + ".mp4");
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "错误",
      detail: e,
      life: 1500,
    });
  } finally {
    converting.value = false;
  }
};
</script>

<template>
  <p-toast />
  <div
    class="video-card flex flex-col w-60 cursor-pointer"
    :class="{
      selected: selected === item,
    }"
    @click="handleClick"
  >
    <Panel :header="item.name">
      <Button :disabled="converting" @click="handleDownload">{{
        converting ? "转换中" : "下载"
      }}</Button>
    </Panel>
  </div>
</template>

<style lang="scss" scoped>
.video-card {
  &.selected {
    :deep(.p-panel-header) {
      background-color: #a1b9d0;
    }
    :deep(.p-panel-title) {
      color: #fff;
    }
  }
}
</style>
