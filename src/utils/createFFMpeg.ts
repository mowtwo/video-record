import { createFFmpeg } from "@ffmpeg/ffmpeg"

const ffmpeg = createFFmpeg({
  log: true,
  corePath: '/lib/ffmpeg-core/ffmpeg-core.js'
})

export default ffmpeg
