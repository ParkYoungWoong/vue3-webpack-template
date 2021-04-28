import { double } from './example'

test('인수가 숫자 데이터입니다', () => {
  expect(double(2)).toBe(4)
  expect(double(7)).toBe(14)
})

test('인수가 문자 데이터입니다', () => {
  expect(double('2')).toBe(4)
  expect(double('10')).toBe(20)
})
