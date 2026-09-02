import type { DatapackConfig, ResourcePackConfig, SandstoneConfig } from 'sandstone'

export default {
  name: 'easy-macro',
  packs: {
    datapack: {
      description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' datapack.' ],
      packFormat: 101,
    } as DatapackConfig,
    resourcepack: {
      description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' resource pack.' ],
      packFormat: 84,
    } as ResourcePackConfig
  },
  onConflict: {
    default: 'warn',
  },
  namespace: 'easy-macro',
  packUid: 'KvaHgJy0',
  mcmeta: 'latest',
  saveOptions: {},
} as SandstoneConfig
