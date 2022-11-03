export const downloadVideo = (href: string, name: string = `${Date.now()}-capture-record.mp4`) => {
  const archor = document.createElement('a')
  archor.href = href
  archor.download = name
  archor.click()
}
