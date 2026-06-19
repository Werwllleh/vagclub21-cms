import { GlobalConfig } from 'payload'

export const Policy: GlobalConfig = {
  slug: 'policy',
  label: 'Политика конфиденциальности',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      label: 'Описание',
      type: 'richText',
    },
  ],
}
