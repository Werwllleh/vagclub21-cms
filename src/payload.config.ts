import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import {HeroSlider} from "@/collections/HeroSlider";
import { Meet } from '@/globals/Meet/config'
import { Partner } from '@/collections/Partner'
import { PartnerCategory } from '@/collections/PartnerCategory'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.CMS_URL,
  cors: [
    String(process.env.SERVER_URL),
    String(process.env.CMS_URL),
  ],
  csrf: [
    String(process.env.SERVER_URL),
    String(process.env.CMS_URL),
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, HeroSlider, Partner, PartnerCategory],
  globals: [Meet],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
