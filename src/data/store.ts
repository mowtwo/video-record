import { ref, shallowRef } from "vue"

export interface VideoItem {
  name: string,
  key: number
}

export const captureName = ref('')
export const cacheVideoList = ref<VideoItem[]>([])

export const cacheVideoListMap = new Map<number, Blob>()

export const selected = ref<VideoItem>()
