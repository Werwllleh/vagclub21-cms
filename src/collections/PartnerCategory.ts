import type { CollectionConfig } from 'payload'
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
}