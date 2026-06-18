import  { CollectionConfig, headersWithCors } from 'payload'
import { slugify } from '@/lib/generateSlug'

export const PartnerCategory: CollectionConfig = {
  slug: 'partner_category',
  labels: {
    singular: 'Категория партнера',
    plural: 'Категории партнеров',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data

        if (operation === 'create' && data.title && !data.slug) {
          data.slug = slugify(String(data.title))
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название',
      admin: {
        description: 'Название категории на русском',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        description: 'Автоматически генерируется из названия',
        readOnly: true,
        hidden: true,
      },
    },
  ],
  endpoints: [
    {
      path: '/c',
      method: 'get',
      handler: async (req) => {
        const categories = await req.payload.find({
          collection: 'partner_category',
          select: {
            updatedAt: false,
            createdAt: false,
          },
          limit: 0,
          depth: 1,
          sort: 'title',
        })

        return Response.json(
          {
            categories: categories.docs,
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
  ],
}
