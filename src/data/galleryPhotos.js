// foto5–23 (galería original) + Foto24–52 (nuevas)
const legacyPhotos = Array.from({ length: 19 }, (_, i) => `/images/foto${i + 5}.jpeg`)

const newPhotos = Array.from({ length: 29 }, (_, i) => `/images/Foto${i + 24}.jpeg`)

export const galleryPhotos = [...legacyPhotos, ...newPhotos]
