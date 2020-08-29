import storyblokImages, { API_DOCS_REFERENCE_TEXT } from '../src'

const RAW_IMAGE_URL =
  'https://a.storyblok.com/f/90668/4180x2335/306bb807eb/vallehermoso1.jpg'

const EXPECTED_URL_BASE = 'https://img2.storyblok.com'
const EXPECTED_URL_RESOURCE = '/f/90668/4180x2335/306bb807eb/vallehermoso1.jpg'
const EXAMPLE_SIZE = { width: 200, height: 200 }
const BASE_CONFIG = { url: RAW_IMAGE_URL, size: EXAMPLE_SIZE }

describe('storyblokImages', () => {
  describe('Ensuring correct config is provided', () => {
    test('should throw error when no config provided', () => {
      expect(() => storyblokImages()).toThrow(
        `Missing config.${API_DOCS_REFERENCE_TEXT}`
      )
    })
    test('should throw error when no url provided', () => {
      expect(() => storyblokImages({})).toThrow(
        `Missing mandatory field in config: url.${API_DOCS_REFERENCE_TEXT}`
      )
    })

    test('should throw error when no size provided', () => {
      expect(() => storyblokImages({ url: RAW_IMAGE_URL })).toThrow(
        `Missing mandatory field in config: size.${API_DOCS_REFERENCE_TEXT}`
      )
    })

    test('should not throw error when size has not been provided but quality has', () => {
      expect(() =>
        storyblokImages({ url: RAW_IMAGE_URL, quality: 10 })
      ).not.toThrow()
    })

    test('should throw error when format provided is incorrect', () => {
      expect(() =>
        storyblokImages({
          ...BASE_CONFIG,
          format: 'svg',
        })
      ).toThrow(
        `Format svg is not allowed. Please use png, webp, jpeg.${API_DOCS_REFERENCE_TEXT}`
      )
    })

    test('should throw error when focalPoints are included but not well formatted', () => {
      expect(() =>
        storyblokImages({
          ...BASE_CONFIG,
          focalPoints: [],
        })
      ).toThrow(
        `focalPoints key is nor properly formatted.${API_DOCS_REFERENCE_TEXT}`
      )
    })

    test('should throw error when any focalPoint is not a number', () => {
      expect(() =>
        storyblokImages({
          ...BASE_CONFIG,
          focalPoints: [
            [12, 'meeec'],
            [39, 23],
          ],
        })
      ).toThrow(
        `focalPoints key is nor properly formatted.${API_DOCS_REFERENCE_TEXT}`
      )
    })

    test('should not throw error when focalPoints is falsy', () => {
      expect(() =>
        storyblokImages({
          ...BASE_CONFIG,
          focalPoints: null,
        })
      ).not.toThrow()
    })
  })

  describe('Resizing', () => {
    test('should return given height and width', () => {
      expect(
        storyblokImages({
          url: RAW_IMAGE_URL,
          size: {
            height: 500,
            width: 500,
          },
        })
      ).toBe(`${EXPECTED_URL_BASE}/500x500${EXPECTED_URL_RESOURCE}`)
    })

    test('should return 0 on width when no provided', () => {
      expect(
        storyblokImages({
          url: RAW_IMAGE_URL,
          size: {
            height: 500,
          },
        })
      ).toBe(`${EXPECTED_URL_BASE}/0x500${EXPECTED_URL_RESOURCE}`)
    })

    test('should return 0 on height when no provided', () => {
      expect(
        storyblokImages({
          url: RAW_IMAGE_URL,
          size: {
            width: 500,
          },
        })
      ).toBe(`${EXPECTED_URL_BASE}/500x0${EXPECTED_URL_RESOURCE}`)
    })
  })

  describe('Fit-In', () => {
    const BASE_FIT_IN_CONFIG = {
      ...BASE_CONFIG,
      fitIn: true,
    }
    test('should add a transparent fill and formatted as PNG when no specific filter color given', () => {
      expect(storyblokImages({ ...BASE_FIT_IN_CONFIG })).toBe(
        `${EXPECTED_URL_BASE}/fit-in/200x200/filters:fill(transparent):format(png)${EXPECTED_URL_RESOURCE}`
      )
    })

    test('should add given fill filter', () => {
      expect(storyblokImages({ ...BASE_FIT_IN_CONFIG, fill: 'CCCCCC' })).toBe(
        `${EXPECTED_URL_BASE}/fit-in/200x200/filters:fill(CCCCCC)${EXPECTED_URL_RESOURCE}`
      )
    })

    test('should add given fill filter and format filter', () => {
      expect(
        storyblokImages({
          ...BASE_FIT_IN_CONFIG,
          fill: 'CCCCCC',
          format: 'png',
        })
      ).toBe(
        `${EXPECTED_URL_BASE}/fit-in/200x200/filters:fill(CCCCCC):format(png)${EXPECTED_URL_RESOURCE}`
      )
    })
  })

  describe('Format', () => {
    test('should include given format', () => {
      expect(storyblokImages({ ...BASE_CONFIG, format: 'webp' })).toBe(
        `${EXPECTED_URL_BASE}/200x200/filters:format(webp)${EXPECTED_URL_RESOURCE}`
      )
    })
  })

  describe('Quality', () => {
    test('should include quality (with size)', () => {
      expect(storyblokImages({ ...BASE_CONFIG, quality: 10 })).toBe(
        `${EXPECTED_URL_BASE}/200x200/filters:quality(10)${EXPECTED_URL_RESOURCE}`
      )
    })

    test('should include quality (without size)', () => {
      expect(storyblokImages({ url: RAW_IMAGE_URL, quality: 10 })).toBe(
        `${EXPECTED_URL_BASE}/filters:quality(10)${EXPECTED_URL_RESOURCE}`
      )
    })
  })

  describe('Smart', () => {
    test('should include /smart', () => {
      expect(storyblokImages({ ...BASE_CONFIG, smartCrop: true })).toBe(
        `${EXPECTED_URL_BASE}/200x200/smart${EXPECTED_URL_RESOURCE}`
      )
    })
  })

  describe('Focal Points', () => {
    test('should include smart crop, quality and format', () => {
      expect(
        storyblokImages({
          ...BASE_CONFIG,
          focalPoints: [
            [100, 200],
            [110, 220],
          ],
        })
      ).toBe(
        `${EXPECTED_URL_BASE}/200x200/filters:focal(100x200:110x220)${EXPECTED_URL_RESOURCE}`
      )
    })
  })

  describe('Combine different filters', () => {
    test('should include smart crop, quality and format', () => {
      expect(
        storyblokImages({
          ...BASE_CONFIG,
          quality: 50,
          smartCrop: true,
          format: 'png',
        })
      ).toBe(
        `${EXPECTED_URL_BASE}/200x200/smart/filters:quality(50):format(png)${EXPECTED_URL_RESOURCE}`
      )
    })

    test('should include only format', () => {
      expect(
        storyblokImages({
          url: RAW_IMAGE_URL,
          format: 'png',
        })
      ).toBe(
        'https://img2.storyblok.com/filters:format(png)/f/90668/4180x2335/306bb807eb/vallehermoso1.jpg'
      )
    })

    test('should include format and quality without resizing', () => {
      expect(
        storyblokImages({
          url: RAW_IMAGE_URL,
          format: 'webp',
          quality: 30,
        })
      ).toBe(
        'https://img2.storyblok.com/filters:quality(30):format(webp)/f/90668/4180x2335/306bb807eb/vallehermoso1.jpg'
      )
    })
  })
})
