import { GlobalConfig, headersWithCors } from 'payload'

export const Meet: GlobalConfig = {
  slug: 'meet',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'richText',
    },
    {
      name: 'coordinates',
      label: 'Координаты места встречи',
      type: 'group',
      fields: [
        {
          name: 'lat',
          label: 'Широта',
          type: 'number',
          required: true,
        },
        {
          name: 'lng',
          label: 'Долгота',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'address',
      label: 'Адрес текстом',
      type: 'text',
    },
    {
      name: 'date',
      label: 'Дата встречи',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeFormat: 'HH:mm',
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
      },
      timezone: {
        defaultTimezone: 'Europe/Moscow',
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
        description: 'Если выключено — событие не будет возвращаться в API для публичного доступа',
      },
    },
  ],
  endpoints: [
    {
      path: '/',
      method: 'get',
      handler: async (req) => {
        const meet = await req.payload.findGlobal({
          slug: 'meet',
          depth: 2,
        })

        if (!meet.active) {
          return Response.json(
            { meet: null },
            {
              status: 404,
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          )
        }

        return Response.json(
          { meet },
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
