const readAsDataURL = (file: Blob) => new Promise<string>(resolve => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.addEventListener('load', () => {
    resolve(reader.result!.toString())
  })
})

export default readAsDataURL
