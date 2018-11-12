before(() => true)

xdescribe('Remote reporter', () => {
  before(() => true)

  it('works', () => true)
  it('throws', () => Promise.reject(new Error('muhaha')))
  xit('is in pending state')
})

xdescribe('Another suite', () => {
  after(() => Promise.reject(new Error('after fail')))

  it('works', () => true)
})
