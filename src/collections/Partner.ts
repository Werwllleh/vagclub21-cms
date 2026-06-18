import { CollectionConfig, headersWithCors } from 'payload'
import { slugify } from '@/lib/generateSlug'
import { types } from 'sass'
import Boolean = types.Boolean

export const Partner: CollectionConfig = {
  slug: 'partner',
  labels: {
    singular: 'Партнер',
    plural: 'Партнеры',
  },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (data.title && !data.slug) {
          data.slug = slugify(String(data.title))
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'slug',
      label: 'Символьная ссылка',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Оставь пустым — сгенерируется из названия',
      },
    },
    {
      name: 'active',
      label: 'Опубликовать',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Если выключено — компания не будет возвращаться в API для публичного доступа',
      },
    },
    {
      name: 'blacklist',
      label: 'Компания в ЧС',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Если включено — компания будет в ЧС',
      },
    },
    {
      name: 'verified',
      label: 'Проверенная компания',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Если проверенная — отметить',
      },
    },
    {
      name: 'logo',
      label: 'Логотип компании',
      type: 'relationship',
      relationTo: 'media_partners',
    },
    {
      name: 'gallery',
      label: 'Галерея',
      type: 'relationship',
      relationTo: 'media_partners',
      hasMany: true,
      admin: {
        description: 'Фото процесса работ компании (желательно несколько)',
      },
    },
    {
      name: 'title',
      label: 'Название компании',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Описание партнера (что продает/производит)',
      },
    },
    {
      name: 'address',
      label: 'Адрес компании',
      type: 'text',
    },
    {
      name: 'categories',
      label: 'Категории',
      type: 'relationship',
      relationTo: 'partner_category',
      hasMany: true,
      required: true,
      admin: {
        description: 'Выбрать категории принадлежащие компании',
      },
    },
    {
      name: 'discount',
      label: 'Размер скидки',
      type: 'select',
      options: [
        { label: '5', value: '5' },
        { label: '10', value: '10' },
        { label: '15', value: '15' },
        { label: '20', value: '20' },
        { label: '25', value: '25' },
        { label: '30', value: '30' },
        { label: '35', value: '35' },
        { label: '40', value: '40' },
        { label: '45', value: '45' },
        { label: '50', value: '50' },
        { label: '55', value: '55' },
        { label: '60', value: '60' },
        { label: '65', value: '65' },
        { label: '70', value: '70' },
        { label: '75', value: '75' },
        { label: '80', value: '80' },
        { label: '85', value: '85' },
        { label: '90', value: '90' },
        { label: '95', value: '95' },
        { label: '100', value: '100' },
      ],
      admin: {
        description: 'Размер скидки для клубных пользователей',
      },
    },
    {
      type: 'group',
      name: 'contacts',
      label: 'Контакты',
      fields: [
        {
          name: 'instagram',
          label: 'Instagram',
          type: 'text',
          admin: {
            description: 'Ссылка на Instagram',
          },
        },
        {
          name: 'telegram',
          label: 'Telegram',
          type: 'text',
          admin: {
            description: 'Ссылка на Telegram',
          },
        },
        {
          name: 'max',
          label: 'MAX',
          type: 'text',
          admin: {
            description: 'Ссылка на MAX',
          },
        },
        {
          name: 'vk',
          label: 'VK',
          type: 'text',
          admin: {
            description: 'Ссылка на VK',
          },
        },
        {
          name: 'phones',
          label: 'Телефоны',
          type: 'array',
          fields: [
            {
              name: 'phone',
              label: 'Телефон',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'emails',
          label: 'Email',
          type: 'array',
          fields: [
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              required: true,
            },
          ],
        },
        {
          name: 'site',
          label: 'Сайт компании',
          type: 'text',
          admin: {
            description: 'Ссылка на сайт компании',
          },
        },
        {
          name: 'yandexMaps',
          label: 'Профиль в Яндекс Картах',
          type: 'text',
          admin: {
            description: 'Ссылка на профиль организации в Яндекс Картах',
          },
        },
      ],
    },
    {
      name: 'sort',
      label: 'Сортировка',
      type: 'number',
      required: true,
      defaultValue: 100,
      admin: {
        description: 'Сортировка компаний',
      },
    },
    {
      type: 'group',
      name: 'seo',
      label: 'SEO (meta)',
      fields: [
        {
          name: 'title',
          label: 'Meta title',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Meta description',
          type: 'textarea',
        },
      ],
    },
  ],
  endpoints: [
    // GET /api/partner/c?page=1&verified=true&category=avtoservis,chip-tyuning
    {
      path: '/c',
      method: 'get',
      handler: async (req) => {
        // @ts-ignore
        const url = new URL(req.url)

        const pageParam = Number(url.searchParams.get('page'))
        const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

        const limit = Number(url.searchParams.get('limit'))

        const verified = url.searchParams.get('verified') === 'true'
        const blockedStatus = url.searchParams.get('blacklist') === 'true'
        const categoriesParams = url.searchParams.get('category')
        const categorySlugs = categoriesParams?.split(',') || []

        const where: any = {
          active: {
            equals: true,
          },
          blacklist: {
            equals: blockedStatus,
          }
        }

        if (verified) {
          where.verified = {
            equals: true,
          }
        }

        let categoryIds: number[] = []

        if (!!categorySlugs.length) {
          const foundCategories = await req.payload.find({
            collection: 'partner_category',
            select: {
              updatedAt: false,
              createdAt: false,
            },
            where: {
              slug: {
                in: categorySlugs,
              },
            },
          })

          categoryIds = foundCategories.docs.map((item) => item.id)
        }

        if (categoryIds.length) {
          where.categories = {
            in: categoryIds,
          }
        }

        const partners = await req.payload.find({
          collection: 'partner',
          where,
          select: {
            blacklist: false,
            active: false,
            updatedAt: false,
            createdAt: false,
          },
          depth: 1,
          page,
          limit: limit,
          sort: 'sort',
        })

        return Response.json(
          {
            partners: partners.docs,
            hasNextPage: partners.hasNextPage,
            totalPages: partners.totalPages,
            totalCount: partners.totalDocs,
          },
          {
            status: 200,
            headers: headersWithCors({
              headers: new Headers(),
              req,
            }),
          },
        )
      },
    },

    // GET /api/partner/c/:slug
    {
      path: '/c/:slug',
      method: 'get',
      handler: async (req) => {
        const slug = req.routeParams?.slug as string | undefined

        if (!slug) {
          return Response.json({ message: 'Slug обязателен' }, { status: 400 })
        }

        const result = await req.payload.find({
          collection: 'partner',
          where: {
            and: [{ slug: { equals: slug } }, { active: { equals: true } }],
          },
          select: {
            active: false,
            updatedAt: false,
            createdAt: false,
          },
          limit: 1,
          depth: 1,
        })

        const partner = result.docs[0]

        if (!partner) {
          return Response.json({ message: 'Компания не найдена' }, { status: 404 })
        }

        return Response.json(partner, { status: 200 })
      },
    },
  ],
}
