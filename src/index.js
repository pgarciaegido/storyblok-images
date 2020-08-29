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
  focalPoints: [
    [100, 100],
    [100, 100],
  ],
} */

const IMG_CONTENT_BASE_URL = 'https://a.storyblok.com'
const IMG_BASE_URL = 'https://img2.storyblok.com'
const API_DOCS_REFERENCE = 'https://github.com/pgarciaegido/storyblok-images'

export const API_DOCS_REFERENCE_TEXT = ` Check storyblok-images documentation: ${API_DOCS_REFERENCE}`

const DEFAULT_FIT_IN_FILTERS = '/filters:fill(transparent):format(png)'

const allowedFormats = ['png', 'webp', 'jpeg']

const addAPIReference = (str) => str + API_DOCS_REFERENCE_TEXT

const missingMandatoryFieldError = (field) =>
  addAPIReference(`Missing mandatory field in config: ${field}.`)

const errorFormat = (format) =>
  addAPIReference(
    `Format ${format} is not allowed. Please use ${allowedFormats.join(', ')}.`
  )

const checkFocalPoint = (point) => point && !isNaN(point)

const correctFocalPoints = ({ focalPoints }) =>
  focalPoints[0] &&
  checkFocalPoint(focalPoints[0][0]) &&
  checkFocalPoint(focalPoints[0][1]) &&
  checkFocalPoint(focalPoints[1][0]) &&
  checkFocalPoint(focalPoints[1][1])

const checkFieldsValidity = (config) => {
  if (!config) throw new Error(addAPIReference(`Missing config.`))
  if (!config.url) throw new Error(missingMandatoryFieldError('url'))
  if (!config.quality && !config.format && !config.size)
    throw new Error(missingMandatoryFieldError('size'))
  if (config.format && !allowedFormats.includes(config.format))
    throw new Error(errorFormat(config.format))
  if (config.focalPoints && !correctFocalPoints(config))
    throw new Error(
      addAPIReference('focalPoints key is nor properly formatted.')
    )
}

const getWidth = ({ size }) => (size && size.width) || 0
const getHeight = ({ size }) => (size && size.height) || 0
const hasWidthOrHeight = ({ size }) =>
  (size && size.width) || (size && size.height)

const formatSize = (config) =>
  hasWidthOrHeight(config) ? `/${getWidth(config)}x${getHeight(config)}` : ''
const formatFormat = ({ format }) => (format ? `:format(${format})` : '')
const formatQuality = (config) => `:quality(${config.quality})`
const formatFocalPoints = (config) => {
  const [leftTop, rightBottom] = config.focalPoints
  return `:focal(${leftTop[0]}x${leftTop[1]}:${rightBottom[0]}x${rightBottom[1]})`
}

const hasFilters = ({ quality, format, focalPoints }) =>
  quality || format || focalPoints

const formatFilters = (config) => {
  if (hasFilters(config)) {
    let base = '/filters'

    if (config.quality) base += formatQuality(config)
    if (config.format) base += formatFormat(config)
    if (config.focalPoints) base += formatFocalPoints(config)

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
