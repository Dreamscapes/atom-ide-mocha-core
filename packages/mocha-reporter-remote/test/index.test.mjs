before(() => true)

describe('Remote reporter', () => {
  before(() => true)

  it('works', () => true)
  it('works after some time', done => {
    setTimeout(done, 10)
  })
  xit('throws', () => Promise.reject(new Error('muhaha')))
  xit('is in pending state')


  xdescribe('Another suite', () => {
    after(() => Promise.reject(new Error('after fail')))

    it('works', () => true)
  })
})
