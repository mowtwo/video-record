<script lang="ts" setup>
import { ref, shallowRef } from "vue";
import { captureName, cacheVideoList, cacheVideoListMap } from "../data/store";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
const toast = useToast();
const confirm = useConfirm();

const screenStart = ref(true);
const videoStart = ref(true);
const videoRef = ref<HTMLVideoElement>();
const screenStream = shallowRef<MediaStream>();
const recordChunk = shallowRef<Blob[]>([]);
const recorder = shallowRef<MediaRecorder>();

const handleTrackStop = () => {
  screenStart.value = true;
  screenStream.value = undefined;
  // console.log(recorder.value?.state);
  if (recorder.value?.state === "inactive") {
    recorder.value?.stop();
  }
  recorder.value = undefined;
  toast.add({
    severity: "warn",
    summary: "成功",
    detail: "屏幕捕捉已关闭",
    life: 1500,
  });
};

const handleCapture = async () => {
  if (!screenStart.value) {
    if (!!screenStream.value) {
      const stream = screenStream.value!;
      const activeTrack = stream.getTracks()[0];
      if (activeTrack) {
        activeTrack.stop();
        activeTrack.dispatchEvent(new Event("ended"));
        stream.removeTrack(activeTrack);
      }
    }
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    const activeTrack = stream.getTracks()[0];
    if (activeTrack) {
      console.log("add");
      activeTrack.addEventListener("ended", () => {
        console.log("stop");
        handleTrackStop();
      });
    }
    screenStream.value = stream;
    screenStart.value = false;
    videoRef.value!.srcObject = stream;
    toast.add({
      severity: "success",
      summary: "成功",
      detail: "屏幕捕捉已开启",
      life: 1500,
    });
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "错误",
      detail: e.message === "Permission denied" ? "用户取消了捕获" : e,
      life: 1500,
    });
  }
};

const handleVideoLoaded = async () => {
  if (screenStream.value) {
    await videoRef.value!.play();
  }
};

const handleRecord = async () => {
  const isSafari = () =>
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  if (!videoStart.value) {
    recorder.value?.stop();
    recorder.value = undefined;
    return;
  }
  if (screenStream.value) {
    recordChunk.value = [];
    const rc = new MediaRecorder(screenStream.value!, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: isSafari() ? "video/mp4" : "video/webm",
    });
    recorder.value = rc;
    toast.add({
      severity: "success",
      summary: "成功",
      detail: "屏幕录制已开启",
      life: 1500,
    });
    rc.addEventListener("dataavailable", (e) => {
      if (!!e.data && e.data.size > 0) {
        recordChunk.value.push(e.data);
      }
    });
    rc.addEventListener("stop", () => {
      if (recordChunk.value && recordChunk.value.length > 0) {
        const key = Date.now();
        const item = {
          name: `${captureName.value || "未命名视频"}-${key}`,
          key,
        };
        cacheVideoList.value.push(item);
        cacheVideoListMap.set(
          key,
          new Blob(recordChunk.value, {
            type: "video/mp4",
          })
        );
      }
      videoStart.value = true;
      toast.add({
        severity: "warn",
        summary: "成功",
        detail: "屏幕录制已关闭",
        life: 1500,
      });
    });
    rc.start(10);
    videoStart.value = false;
  }
};

const tempFileName = ref("");

const handleUpdateName = (e: Event) => {
  tempFileName.value = captureName.value;
  confirm.require({
    group: "updateName",
    target: e.currentTarget as HTMLDivElement,
    acceptLabel: "保存",
    rejectLabel: "取消",
    accept() {
      captureName.value = tempFileName.value;
    },
  });
};
</script>

<template>
  <p-toast />
  <p-confirmpopup group="updateName">
    <template #message>
      <div class="p-2">
        <InputText v-model="tempFileName" placeholder="请输入名字" />
      </div>
    </template>
  </p-confirmpopup>
  <Panel>
    <template #header>
      <span
        class="p-panel-title cursor-pointer"
        v-tooltip="'点击改名'"
        @click="handleUpdateName"
      >
        {{ `【预览】${captureName || "未命名视频"}` }}
      </span>
    </template>
    <div class="preview">
      <video ref="videoRef" @loadeddata="handleVideoLoaded" muted></video>
      <div
        class="tools"
        :class="{
          recording: !videoStart,
        }"
      >
        <div class="bar">
          <Toolbar>
            <template #start>
              <span class="mr-2">
                <ToggleButton
                  on-icon="pi pi-desktop"
                  off-label="停止捕获"
                  off-icon="pi pi-stop"
                  on-label="开始"
                  v-tooltip.top="{
                    value: '屏幕捕获',
                    disabled: !screenStart,
                  }"
                  :modelValue="screenStart"
                  @click="handleCapture"
                ></ToggleButton>
              </span>
              <ToggleButton
                on-icon="pi pi-video"
                off-label="停止录屏"
                off-icon="pi pi-stop"
                on-label="开始"
                v-tooltip.top="{
                  value: '视频录制',
                  disabled: !videoStart,
                }"
                :modelValue="videoStart"
                :disabled="screenStart && videoStart"
                @click="handleRecord"
              ></ToggleButton>
            </template>
          </Toolbar>
        </div>
      </div>
    </div>
  </Panel>
</template>

<style lang="scss" scoped>
.p-panel {
  height: 100%;
  display: flex;
  flex-flow: column;
  :deep(.p-toggleable-content) {
    flex: 1;
    overflow: hidden;
  }
  :deep(.p-panel-content) {
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
    .tools {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      &.recording {
        border: red solid 2px;
        &::after {
          content: "录制中";
          position: absolute;
          font-size: 12px;
          color: #fff;
          top: 0;
          right: 0;
          padding: 4px 6px 8px 6px;
          background-color: red;
        }
      }
      .bar {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
}
</style>
