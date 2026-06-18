import {CollectionConfig, headersWithCors} from 'payload'

export const HeroSlider: CollectionConfig = {
  slug: 'hero_slider',
  labels: {
    singular: 'Cлайдер на главной',
    plural: 'Cлайдер на главной',
  },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {},
  fields: [
    {
      name: 'title',
      label: 'Title слайда',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'richText',
    },
    {
      name: 'detail_link',
      label: 'Кнопка-переход',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Текст кнопки',
          type: 'text',
          defaultValue: 'Подробнее',
          required: true,
        },
        {
          name: 'url',
          label: 'Ссылка (куда ведет)',
          type: 'text',
          defaultValue: '#',
          required: true,
        },
      ],
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
      name: 'bg_image',
      label: 'Фоновое фото',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
  ],
  endpoints: [
    {
      path: '/',
      method: 'get',
      handler: async (req) => {
        const where: any = {
          active: { equals: true },
        }

        const slides = await req.payload.find({
          collection: 'hero_slider',
          where,
          depth: 2,
          sort: '-createdAt',
        })

        return Response.json(
          {
            slider: slides.docs,
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
