import { arrayDeepDup } from "../../utils/arrayDeepDup"
import { formatRows, formatSingleRow } from "../rowFormatter"
import { CSVResult } from "../types"

describe('rowFormatter', () => {
  const results: CSVResult[] = [
    {
      Member:  'Bob Joe', 
      Email:'bobjoe@email.com', 
      'Partner Member': '', 
      'Partner Email': '',
      'Big Red Numbers': '1234',
    },
    {
      Member: 'Another Member',
      Email: 'anothermember@email.com',
      'Partner Member': '',
      'Partner Email': '',
      'Big Red Numbers': '456'
    }
  ]
  describe('formatRows', () => {
    test('it should gather rows correctly', () => {
      const { 'Partner Email': partnerEmail, ...joeFields } = results[0]
      const { 'Partner Email': anotherPartner, ...anotherFields } = results[1]
      const output = [
        { ...joeFields, 'First Name': 'Bob', 'Last Name': 'Joe' },
        { ...anotherFields, 'First Name': 'Another', 'Last Name': 'Member' }
      ]
      expect(formatRows(results)).toEqual(output)
    })

    test('it should add an additional row for partners', () => {
      const relevantResults = arrayDeepDup(results);
      relevantResults[0]['Partner Member'] = 'Sally Joe'
      relevantResults[0]['Partner Email'] = 'sallyjoe@email.com'
      const { 'Partner Email': partnerEmail, ...joeFields } = relevantResults[0]
      const { 'Partner Email': anotherPartner, ...anotherFields } = relevantResults[1]
      const output = [
        { ...joeFields, 'First Name': 'Bob', 'Last Name': 'Joe' },
        {
          'Big Red Numbers': results[0]['Big Red Numbers'],
          Member: 'Sally Joe',
          'Partner Member': 'Bob Joe',
          'First Name': 'Sally',
          'Last Name': 'Joe',
          Email: 'sallyjoe@email.com'
        },
        { ...anotherFields, 'First Name': 'Another', 'Last Name': 'Member' }
      ]
      expect(formatRows(relevantResults)).toEqual(output)
    })

    test('it should remove duplicate big red numbers', () => {
      const relevantResults = [...results, results[1]]
      expect(formatRows(relevantResults).length).toEqual(2)
    })
  })
})

describe('formatSingleRow', () => {
  const baseResult: CSVResult = {
    Email: 'joebob@email.com',
    'Big Red Numbers': '1234',
    Member: 'Joe Bob',
    'Partner Email': 'sallybob@email.com',
    'Partner Member': 'Sally Bob'

  }
  describe('when partner result', () => {
    test('it will remove 1 in partner email if they share the email', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'joebob1@email.com',
      }
      const {
        'Partner Email': partnerEmail,
        'Partner Member': mainPartner,
        Email,
        ...rest
      } = result;
      const outcome = [
        {
          ...rest,
          Email,
          'Partner Member': mainPartner,
          'First Name': 'Joe',
          'Last Name': 'Bob'
        },
        {
          'Big Red Numbers': result['Big Red Numbers'],
          Email,
          'First Name': 'Sally',
          'Last Name': 'Bob',
          'Partner Member': result.Member,
          'Member': result['Partner Member']
        }
      ]
      expect(formatSingleRow(result)).toEqual(outcome)
    })

    test('it will remove + in partner email if they share the email', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'joebob+@email.com',
      }
      const {
        'Partner Email': partnerEmail,
        'Partner Member': mainPartner,
        Email,
        ...rest
      } = result;
      const outcome = [
        {
          ...rest,
          Email,
          'Partner Member': mainPartner,
          'First Name': 'Joe',
          'Last Name': 'Bob'
        },
        {
          'Big Red Numbers': result['Big Red Numbers'],
          Email,
          'First Name': 'Sally',
          'Last Name': 'Bob',
          'Partner Member': result.Member,
          'Member': result['Partner Member']
        }
      ]
      expect(formatSingleRow(result)).toEqual(outcome)
    })

    test('it will not remove 1 if emails are different', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'sallybob1@email.com',
      }
      expect(formatSingleRow(result)[1].Email).toEqual('sallybob1@email.com')
    })

    test('it will not remove + if emails are different', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'sallybob+@email.com',
      }
      expect(formatSingleRow(result)[1].Email).toEqual('sallybob+@email.com')
    })
  })
})