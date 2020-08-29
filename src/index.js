/* config = {
  url: '',
  size: {
    width: 0,
    height: 0,
  },
  fitIn: false,
  fill: 'transparent' || 'cccccc' (hex)
  format: 'webp' || 'jpeg' || 'png'
  quality: 100,
  smartCrop: false,
  focalPoint: [
    [100, 100],
    [100, 100],
  ],
} */

const IMG_CONTENT_BASE_URL = 'https://a.storyblok.com'
const IMG_BASE_URL = 'https://img2.storyblok.com'
const API_DOCS_REFERENCE = 'https://github.com/pgarciaegido/storyblok-images'

const DEFAULT_FIT_IN_FILTERS = '/filters:fill(transparent):format(png)'

const allowedFormats = ['png', 'webp', 'jpeg']

const addAPIReference = (str) =>
  str + ` Check storyblok-images documentation: ${API_DOCS_REFERENCE}`

const missingMandatoryFieldError = (field) =>
  addAPIReference(`Missing mandatory field in config: ${field}.`)

const errorFormat = (format) =>
  addAPIReference(
    `Format ${format} is not allowed. Please use ${allowedFormats.join(', ')}.`
  )

const checkFieldsValidity = (config) => {
  if (!config) throw new Error(addAPIReference(`Missing config.`))
  if (!config.url) throw new Error(missingMandatoryFieldError('url'))
  if (!config.quality && !config.format && !config.size)
    throw new Error(missingMandatoryFieldError('size'))
  if (config.format && !allowedFormats.includes(config.format))
    throw new Error(errorFormat(config.format))
}

const getWidth = ({ size }) => (size && size.width) || 0
const getHeight = ({ size }) => (size && size.height) || 0
const hasWidthOrHeight = ({ size }) =>
  (size && size.width) || (size && size.height)
const formatSize = (config) =>
  hasWidthOrHeight(config) ? `/${getWidth(config)}x${getHeight(config)}` : ''
const formatFormat = ({ format }) => (format ? `:format(${format})` : '')
const formatQuality = (config) => `:quality(${config.quality})`

const hasFilters = ({ quality, format }) => quality || format

const formatFilters = (config) => {
  if (hasFilters(config)) {
    let base = '/filters'

    if (config.quality) base += formatQuality(config)
    if (config.format) base += formatFormat(config)
    return base
  }
  return ''
}

const formatFitIn = (config) => {
  const { fitIn, fill } = config
  const isFitInWithoutFilters = fitIn && !fill
  let base = `/fit-in${formatSize(config)}`

  if (isFitInWithoutFilters) return `${base}${DEFAULT_FIT_IN_FILTERS}`

  return `${base}/filters:fill(${fill})${formatFormat(config)}`
}

const formatSmart = ({ smartCrop }) => (smartCrop ? '/smart' : '')

export default function storyblockImages(config) {
  checkFieldsValidity(config)

  const { url, fitIn } = config

  let formattedUrlBase = IMG_BASE_URL
  if (fitIn) formattedUrlBase += formatFitIn(config)
  else
    formattedUrlBase += `${formatSize(config)}${formatSmart(
      config
    )}${formatFilters(config)}`

  return url.replace(IMG_CONTENT_BASE_URL, formattedUrlBase)
}
