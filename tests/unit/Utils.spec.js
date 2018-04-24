import { upcase } from '@/libs/utils.js'

test('String converted to uppercase', () => {
  expect(upcase('abc')).toBe('ABC')
})
