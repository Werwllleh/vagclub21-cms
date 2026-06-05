import { CollectionConfig, headersWithCors } from 'payload'
import { slugify } from '@/lib/generateSlug'

export const Partner: CollectionConfig = {
  slug: 'partner',
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
        readOnly: true,
        hidden: true,
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
        description: 'Если выключено — партнер не будет возвращаться в API для публичного доступа',
      },
    },
    {
      name: 'verified',
      label: 'Проверенный партнер',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Если проверенный — отметить',
      },
    },
    {
      name: 'logo',
      label: 'Логотип партнера',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      label: 'Галерея',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        description: 'Фото процесса работ партнера (желательно несколько)',
      },
    },
    {
      name: 'title',
      label: 'Название',
      type: 'text',
      required: true,
      admin: {
        description: 'Название партнера',
      },
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
      name: 'categories',
      label: 'Категории',
      type: 'relationship',
      relationTo: 'partner_category',
      hasMany: true,
      required: true,
    },
    {
      name: 'discount',
      label: 'Максимальная скидка',
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
    // GET /api/products/list?inStock=true&priceFrom=100&priceTo=500
    {
      path: '/list',
      method: 'get',
      handler: async (req) => {
        // @ts-ignore
        const url = new URL(req.url)

        const inStock = url.searchParams.get('inStock') // 'true' | 'false' | null
        const priceFrom = url.searchParams.get('priceFrom')
        const priceTo = url.searchParams.get('priceTo')

        const where: any = {
          active: { equals: true },
        }

        // фильтр по наличию
        if (inStock === 'true') where.inStock = { equals: true }
        if (inStock === 'false') where.inStock = { equals: false }

        // фильтр по цене (актуальная цена pricing.price)
        if (priceFrom || priceTo) {
          where['pricing.price'] = {}

          if (priceFrom) where['pricing.price'].greater_than_equal = Number(priceFrom)
          if (priceTo) where['pricing.price'].less_than_equal = Number(priceTo)
        }

        const products = await req.payload.find({
          collection: 'products',
          where,
          depth: 2,
          limit: 1000,
          sort: '-createdAt',
        })

        return Response.json(
          {
            docs: products.docs,
            total: products.totalDocs,
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

    //GET /api/products/stickers
    //GET /api/products/flavours
    //GET /api/products/merch
    //GET /api/products/frames
    {
      path: '/:type',
      method: 'get',
      handler: async (req) => {
        const type = req.routeParams?.type as string | undefined

        if (!type || !['stickers', 'flavours', 'merch', 'frames'].includes(type)) {
          return Response.json({ message: 'Неизвестный тип товара' }, { status: 404 })
        }

        // @ts-ignore
        const url = new URL(req.url)

        const inStock = url.searchParams.get('inStock')
        const priceFrom = url.searchParams.get('priceFrom')
        const priceTo = url.searchParams.get('priceTo')

        const where: any = {
          active: { equals: true },
          type: { equals: type },
        }

        if (inStock === 'true') where.inStock = { equals: true }
        if (inStock === 'false') where.inStock = { equals: false }

        if (priceFrom || priceTo) {
          where['pricing.price'] = {}

          if (priceFrom) {
            where['pricing.price'].greater_than_equal = Number(priceFrom)
          }

          if (priceTo) {
            where['pricing.price'].less_than_equal = Number(priceTo)
          }
        }

        const products = await req.payload.find({
          collection: 'products',
          where,
          depth: 2,
          limit: 1000,
          sort: '-createdAt',
        })

        return Response.json(
          {
            type,
            docs: products.docs,
            total: products.totalDocs,
          },
          { status: 200 },
        )
      },
    },

    // GET /api/products/i/tovar-2
    {
      path: '/i/:slug',
      method: 'get',
      handler: async (req) => {
        const slug = req.routeParams?.slug as string | undefined

        if (!slug) {
          return Response.json({ message: 'Slug обязателен' }, { status: 400 })
        }

        const result = await req.payload.find({
          collection: 'products',
          where: {
            and: [{ slug: { equals: slug } }, { active: { equals: true } }],
          },
          limit: 1,
          depth: 2,
        })

        const product = result.docs?.[0]

        if (!product) {
          return Response.json({ message: 'Товар не найден' }, { status: 404 })
        }

        return Response.json(product, { status: 200 })
      },
    },
  ],
}
