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
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import { MediaPartners } from '@/collections/MediaPartners'
import { TechnicalWork } from '@/globals/TechnicalWork/config'
import {Policy} from "@/globals/Policy/config";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.CMS_URL,
  cors: [String(process.env.SERVER_URL), String(process.env.CMS_URL)],
  csrf: [String(process.env.SERVER_URL), String(process.env.CMS_URL)],
  i18n: {
    supportedLanguages: { en, ru },
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, MediaPartners, Products, HeroSlider, Partner, PartnerCategory],
  globals: [TechnicalWork, Meet, Policy],
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
