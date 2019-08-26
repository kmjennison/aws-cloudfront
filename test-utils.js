const fse = require('fs-extra')
const os = require('os')
const path = require('path')
const CloudFrontComponent = require('./serverless')

module.exports = {
  createComponent: async () => {
    // mock to prevent jest snapshots changing every time
    Date.now = () => 1566599541192

    // create tmp folder to avoid state collisions between tests
    const tmpFolder = await fse.mkdtemp(path.join(os.tmpdir(), 'test-'))

    const component = new CloudFrontComponent('TestCloudFront', {
      stateRoot: tmpFolder
    })

    await component.init()

    return component
  },

  assertCacheBehaviorsContainsItem: (spy, item) => {
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        DistributionConfig: expect.objectContaining({
          CacheBehaviors: expect.objectContaining({
            Items: [expect.objectContaining(item)]
          })
        })
      })
    )
  }
}
