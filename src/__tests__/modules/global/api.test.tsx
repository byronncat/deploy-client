import { uri } from '@global'

describe('api', () => {
  describe('server', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      jest.resetModules() // Most important - it clears the cache
      process.env = { ...OLD_ENV } // Make a copy
    })

    afterAll(() => {
      process.env = OLD_ENV // Restore old environment
    })

    it('should return local uri', () => {
      const { REACT_APP_API_URL, ...rest } = process.env
      process.env = { ...rest }

      const pathMock_1 = uri.getHostingServer('test')
      const pathMock_2 = uri.getHostingServer('/test')

      expect(pathMock_1).toBe('/api/test')
      expect(pathMock_2).toBe('/api/test')
    })

    it('should return hosting server uri', () => {
      process.env.REACT_APP_API_URL = 'https://example.com'

      const path = uri.getHostingServer('test')
      expect(path).toBe('https://example.com/api/test')
    })
  })

  it('should format image CDN correctly', () => {
    const path = uri.transformImageCDN(
      'https://res.cloudinary.com/demo/image/upload/v1626321412/demo.jpg',
      'w_100,fl_lossy,q_auto'
    )

    expect(path).toBe(
      'https://res.cloudinary.com/demo/image/upload/w_100,fl_lossy,q_auto/demo.jpg'
    )
  })
})
