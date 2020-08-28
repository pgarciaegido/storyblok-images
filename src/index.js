/* config = {
  url: '',
  size: {
    width: 0,
    height: 0,
  },
  fitIn: false,
  fill: [transparent || cccccc]
  format: ['webp', 'jpeg', 'png'],
  quality: 100,
  smartCrop: false,
  focalPoint: [
    [100, 100],
    [100, 100],
  ],
} */

const IMG_BASE_URL = 'https://img2.storyblok.com'

const missingMandatoryFieldError = (field) =>
  `Missing mandatory field in config: ${field}`

const checkRequiredFields = (config) => {
  if (!config.url) throw new Error(missingMandatoryFieldError(url))
}

const formatFilters = (config) => {}

export default function storyblockImages(config) {
  checkRequiredFields(config)

  const { url, size, fitIn, format, quality, smartCrop, focalPoint } = config

  const width = (size && size.width) || 0
  const height = (size && size.height) || 0

  const hasFilters = fitIn || format || quality || focalPoint

  const formattedUrlBase = `${IMG_BASE_URL}${
    fitIn ? '/fitIn' : ''
  }/${width}x${height}${hasFilters ? formatFilters(config) : ''}`

  return url.replace('https://a.storyblok.com', formattedUrlBase)
}
