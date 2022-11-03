import { fetchFile } from "@ffmpeg/ffmpeg"
import ffmpeg from "./createFFMpeg"
import readAsDataURL from "./readAsDataURL"

const convertAsDataURL = async (file: Blob, name: string = `${Date.now()}-capture-record.mp4`) => {
  const data = await fetchFile(file)
  const temp = 'temp.webm'
  await ffmpeg.FS('writeFile', temp, data)
  await ffmpeg.run('-i', temp, name)
  const buffer = await ffmpeg.FS('readFile', name)
  const url = await readAsDataURL(new Blob([buffer]))

  return url
}

export default convertAsDataURL
