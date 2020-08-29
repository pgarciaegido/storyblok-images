# :framed_picture: Storyblok Images

Resize and use all the [storyblok images service](https://www.storyblok.com/docs/image-service) operations easily.

## Instalation

Install the package using npm...

```sh
npm install --save storyblok-images
```

or yarn

```sh
yarn add storyblok-images
```

## Basic example

```js
import storyblokImages from 'storyblok-images'

const resizedImage = storyblokImages({
  url: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg', // Image uploaded to Storyblok
  size: {
    // Resize to
    width: 200,
    height: 300,
  },
})

// resizedImage = https://img2.storyblok.com/200x300/f/39898/3310x2192/e4ec08624e/demo-image.jpeg
```

## The configuration object

The configuration object accepts the following values:

| Field       | Required | Type                                           | Default | Example                                                              |
| ----------- | -------- | ---------------------------------------------- | ------- | -------------------------------------------------------------------- |
| url         | true     | String                                         |         | https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg |
| size        | false    | {width: Number, height: Number}                |         | { width: 100, height: 200 }                                          |
| fitIn       | false    | Boolean                                        | false   | false                                                                |
| fill        | false    | String                                         | ''      | 'cccccc'                                                             |
| format      | false    | String. Valid values: 'webp', 'jpeg' and 'png' |         | 'webp'                                                               |
| quality     | false    | Number. From 1 to 100                          |         | 40                                                                   |
| smartCrop   | false    | Boolean                                        | false   | false                                                                |
| focalPoints | false    | Matrix [[number, number], [number, number]]    |         | [[100, 100], [20, 30]]                                               |

:ledger: Chech [storyblok images service](https://www.storyblok.com/docs/image-service) for further details on what any of this fields do.

## Contributing

PRs welcome! Please, follow Prettier rules included in `.vscode`

Running tests:

```sh
npm test
```

Or

```sh
yarn test
```

Thanks! :v:
