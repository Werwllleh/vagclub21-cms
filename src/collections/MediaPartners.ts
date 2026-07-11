import type {CollectionConfig, PayloadHandler} from 'payload'
import {getCookieValue, verifyToken} from "@/lib/verifyToken";

const ACCESS_TOKEN_COOKIE = 'accessToken';

export const deleteMediaHandler: PayloadHandler = async (req) => {
  const token = getCookieValue(req, 'accessToken');

  if (!token) {
    return Response.json(
      {
        message: 'Требуется авторизация',
      },
      {
        status: 401,
      },
    );
  }

  try {
    await verifyToken(token);
  } catch {
    return Response.json(
      {
        message: 'Недействительный или просроченный токен',
      },
      {
        status: 401,
      },
    );
  }

  const mediaId = Number(req.routeParams?.id);

  if (!Number.isInteger(mediaId) || mediaId <= 0) {
    return Response.json(
      {
        message: 'Некорректный ID файла',
      },
      {
        status: 400,
      },
    );
  }

  try {
    await req.payload.delete({
      collection: 'media_partners',
      id: mediaId,
      overrideAccess: true,
    });

    return Response.json(
      {
        message: 'Файл удалён',
        id: mediaId,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    req.payload.logger.error({
      msg: 'Ошибка удаления файла',
      mediaId,
      error,
    });

    return Response.json(
      {
        message: 'Не удалось удалить файл',
      },
      {
        status: 500,
      },
    );
  }
};

export const MediaPartners: CollectionConfig = {
  slug: 'media_partners',
  labels: {
    singular: 'Медиа партнеров',
    plural: 'Медиа партнеров',
  },
  access: {
    read: () => true,
    create: () => true,
    delete: () => false,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: process.env.UPLOAD_PARTNERS_MEDIA,
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/MOV',
      'video/webm',
      'video/ogg',
      'image/svg',
    ],

    // 🔧 Основные параметры для всех загружаемых файлов
    formatOptions: {
      format: 'webp', // конвертация в webp
      options: {
        quality: 80, // сжатие без заметной потери качества
        effort: 4, // баланс скорость/качество (1–6)
        smartSubsample: true, // улучшает детализацию при ресайзе
      },
    },

    resizeOptions: {
      withoutEnlargement: true, // не увеличивать меньшее изображение
      fit: 'inside', // масштабировать, сохраняя пропорции
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  },
  endpoints: [
    {
      path: '/remove/:id',
      method: 'delete',
      handler: deleteMediaHandler,
    },
  ],
}
