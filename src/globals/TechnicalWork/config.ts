import { GlobalConfig, headersWithCors } from 'payload'

export const TechnicalWork: GlobalConfig = {
  slug: 'technical_work',
  label: 'Технические работы',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'active',
      label: 'Сайт работает',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Если выключено — сайт будет недоступен для пользования',
      },
    },
  ],
  endpoints: [
    {
      path: '/',
      method: 'get',
      handler: async (req) => {
        const data = await req.payload.findGlobal({
          slug: 'technical_work',
          depth: 2,
        })

        return Response.json(
          data.active,
          {
            status: 404,
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
