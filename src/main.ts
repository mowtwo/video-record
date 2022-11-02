import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

export { }

const ffmpeg = createFFmpeg({
  log: true
})

await ffmpeg.load()

const start = document.querySelector('.start') as HTMLButtonElement
// const app = document.querySelector('#app') as HTMLDivElement
const video = document.querySelector('.video') as HTMLVideoElement
const replay = document.querySelector('.replay') as HTMLButtonElement
const download = document.querySelector('.download') as HTMLButtonElement


let chunk: Blob[] = []

let recording = false


start.addEventListener('click', async () => {
  if (recording) {
    alert('正在录制，请勿乱动')
    return
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    })
    recording = true
    const record = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: 'video/webm' // chrome仅支持录制webm
    })

    chunk = []
    record.addEventListener('dataavailable', (e) => {
      if (!!e.data && e.data.size > 0) {
        chunk.push(e.data)
      }
    })
    record.start(10)
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      record.stop()
      recording = false
      alert('录制完成')
    })
  } catch (e) {
    alert(e)
  }
})

const readAsDataURL = (file: Blob) => new Promise<string>(resolve => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.addEventListener('load', () => {
    resolve(reader.result!.toString())
  })
})

const convertAsDataURL = async (file: Blob) => {
  const data = await fetchFile(file)
  const temp = 'temp.webm'
  const name = `${Date.now()}-capture-record.mp4`
  await ffmpeg.FS('writeFile', temp, data)
  await ffmpeg.run('-i', temp, name)
  const buffer = await ffmpeg.FS('readFile', name)
  const url = await readAsDataURL(new Blob([buffer]))

  return url
}


replay.addEventListener('click', async () => {
  if (recording) {
    alert('正在录制，请勿乱动')
    return
  }
  if (chunk.length > 0) {
    try {
      // 这个地方转换好像有问题，仅仅是为了支持video播放，实际好像并不是真实的mp4
      const url = await readAsDataURL(new Blob(chunk, {
        type: 'video/mp4'
      }))
      video.src = url
      await video.play()
    } catch (e) {
      alert(e)
    }
  } else {
    alert('视频录制为空')
  }
})

const downloadVideo = (href: string) => {
  const archor = document.createElement('a')
  archor.href = href
  archor.download = `${Date.now()}-capture-record.mp4`
  archor.click()
}

download.addEventListener('click', async () => {
  if (recording) {
    alert('正在录制，请勿乱动')
    return
  }
  if (chunk.length > 0) {
    try {
      download.disabled = true
      download.innerHTML = 'converting'
      const url = await convertAsDataURL(new Blob(chunk))
      downloadVideo(url)
      download.disabled = false
      download.innerHTML = 'download'
    } catch (e) {
      alert(e)
    }
  } else {
    alert('视频录制为空')
  }
})

