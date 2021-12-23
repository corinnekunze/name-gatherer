import { findNamePieces } from "../utilities"

describe('findNamePieces', () => {
  test('it will find first and last name when no middle name', () => {
    expect(findNamePieces('Corinne Kunze')).toEqual({
      firstName: 'Corinne',
      lastName: 'Kunze'
    })
  })

  test('it will find first and last name with middle name', () => {
    expect(findNamePieces('Mary Joe Bob')).toEqual({
      firstName: 'Mary',
      lastName: 'Bob'
    })
  })

  test('it will find first and last name with hyphenated last name', () => {
    expect(findNamePieces('Mary Joe-Bob')).toEqual({
      firstName: 'Mary',
      lastName: 'Joe-Bob'
    })
  })
})
