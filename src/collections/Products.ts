import {CollectionConfig, headersWithCors} from 'payload'
import { slugify } from '@/lib/generateSlug'



export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Товар',
    plural: 'Товары',
  },
  access: { read: () => true },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.name) {
          data.slug = slugify(String(data.name))
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'mark',
      label: 'Значок',
      type: 'select',
      required: false,
      defaultValue: 'none',
      options: [
        { label: 'Ничего', value: 'none' },
        { label: 'Хит', value: 'popular' },
        { label: 'Новинка', value: 'new' },
        { label: 'Распродажа', value: 'sale' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      label: 'Тип товара',
      type: 'select',
      required: true,
      defaultValue: 'stickers',
      options: [
        { label: 'Наклейки', value: 'stickers' },
        { label: 'Ароматизаторы', value: 'flavours' },
        { label: 'Одежда', value: 'merch' },
        { label: 'Номерные рамки', value: 'frames' },
      ],
      admin: {
        position: 'sidebar',
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
        description: 'Если выключено — товар не будет возвращаться в API для публичного доступа',
      },
    },
    {
      name: 'inStock',
      label: 'В наличии',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      label: 'Название',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Символьная ссылка',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Оставь пустым — сгенерируется из названия',
      },
    },
    {
      name: 'mainImage',
      label: 'Главное фото',
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
      admin: {
        description: 'Дополнительные фото товара (можно несколько)',
      },
    },
    {
      type: 'group',
      name: 'pricing',
      label: 'Цена',
      fields: [
        {
          name: 'price',
          label: 'Актуальная цена',
          type: 'number',
          required: true,
          min: 0,
          admin: { step: 1 },
        },
        {
          name: 'oldPrice',
          label: 'Старая цена',
          type: 'number',
          min: 0,
          admin: {
            step: 1,
            description: 'Можно оставить пустым',
          },
        },
      ],
    },
    {
      name: 'characteristics',
      label: 'Характеристики',
      type: 'array',
      fields: [
        {
          name: 'category',
          label: 'Категория',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Например: Материал / Цвет / Размер',
          },
        },
        {
          name: 'values',
          label: 'Значения',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'label',
              label: 'Параметр',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              label: 'Значение',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'richText',
    },
    {
      name: 'seoText',
      label: 'SEO текст',
      type: 'textarea',
      admin: {
        description: 'Длинный SEO-текст (контент на странице товара)',
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
