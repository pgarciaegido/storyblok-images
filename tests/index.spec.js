import storyblokImages from '../src'

const RAW_IMAGE_URL =
  'https://a.storyblok.com/f/90668/4180x2335/306bb807eb/vallehermoso1.jpg'

describe('storyblokImages', () => {
  test('prueba', () => {
    expect(
      storyblokImages({
        url: RAW_IMAGE_URL,
        size: {
          height: 500,
          width: 500,
        },
      })
    ).toBe(
      'https://img2.storyblok.com/500x500/f/90668/4180x2335/306bb807eb/vallehermoso1.jpg'
    )
  })
})
