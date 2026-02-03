import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: process.env.STATIC_DIR,
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/MOV',
      'video/webm',
      'video/ogg',
    ],

    // 🔧 Основные параметры для всех загружаемых файлов
    formatOptions: {
      format: 'webp',         // конвертация в webp
      options: {
        quality: 80,          // сжатие без заметной потери качества
        effort: 4,            // баланс скорость/качество (1–6)
        smartSubsample: true, // улучшает детализацию при ресайзе
      },
    },

    resizeOptions: {
      withoutEnlargement: true, // не увеличивать меньшее изображение
      fit: 'inside',            // масштабировать, сохраняя пропорции
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  },
}
