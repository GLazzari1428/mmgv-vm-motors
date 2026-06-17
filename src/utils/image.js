// le um File de imagem, redimensiona pra um quadrado de maxSize px e devolve base64.
// usado no upload de foto de perfil e do carro pra nao mandar arquivo grande pro backend.
export function compressImageToBase64(file, { maxSize = 256, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('arquivo invalido'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('falha ao ler arquivo'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('falha ao decodificar imagem'))
      img.onload = () => {
        const lado = Math.min(img.width, img.height)
        const sx = (img.width - lado) / 2
        const sy = (img.height - lado) / 2

        const canvas = document.createElement('canvas')
        canvas.width = maxSize
        canvas.height = maxSize
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, sx, sy, lado, lado, 0, 0, maxSize, maxSize)

        try {
          const data = canvas.toDataURL('image/jpeg', quality)
          resolve(data)
        } catch (err) {
          reject(err)
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
