import { arrayDeepDup } from "../../utils/arrayDeepDup"
import { formatRows, formatSingleRow } from "../rowFormatter"
import { CSVResult } from "../types"

describe('rowFormatter', () => {
  const results: CSVResult[] = [
    {
      'Primary Member':  'Bob Joe',
      'Primary Email' :'bobjoe@email.com',
      'Partner Member': '', 
      'Partner Email': '',
      'BRN': '1234',
    },
    {
      'Primary Member': 'Another Member',
      'Primary Email': 'anothermember@email.com',
      'Partner Member': '',
      'Partner Email': '',
      'BRN': '456'
    }
  ]
  describe('formatRows', () => {
    test('it should gather rows correctly', () => {
      const { 'Partner Email': partnerEmail, ...joeFields } = results[0]
      const { 'Partner Email': anotherPartner, ...anotherFields } = results[1]
      const output = [
        { ...joeFields, 'First Name': 'Bob', 'Last Name': 'Joe', 'emailModified': '' },
        { ...anotherFields, 'First Name': 'Another', 'Last Name': 'Member', 'emailModified': '' }
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
        { ...joeFields, 'First Name': 'Bob', 'Last Name': 'Joe', 'emailModified': '' },
        {
          'BRN': results[0]['BRN'],
          'Primary Member': 'Sally Joe',
          'Partner Member': 'Bob Joe',
          'First Name': 'Sally',
          'Last Name': 'Joe',
          'Primary Email': 'sallyjoe@email.com',
          'emailModified': ''
        },
        { ...anotherFields, 'First Name': 'Another', 'Last Name': 'Member', 'emailModified': '' }
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
    'Primary Email': 'joebob@email.com',
    'BRN': '1234',
    'Primary Member': 'Joe Bob',
    'Partner Email': 'sallybob@email.com',
    'Partner Member': 'Sally Bob'

  }

  test('it formats first and last name correctly', () => {
    const result: CSVResult = {
      ...baseResult,
      'Primary Member': 'Kirk E McVay',
    }
    expect(formatSingleRow(result)[0]["First Name"]).toEqual('Kirk');
    expect(formatSingleRow(result)[0]["Last Name"]).toEqual('McVay');
  })

  test('it removes prefix names', () => {
    const result = {
      ...baseResult,
      'Primary Member': 'Dr. Spock Spaceman',
    }
    expect(formatSingleRow(result)[0]["First Name"]).toEqual('Spock');
    expect(formatSingleRow(result)[0]["Last Name"]).toEqual('Spaceman');
  })

  test('it returns only first name when last name is not provided', () => {
    const result = {
      ...baseResult,
      'Primary Member': 'Lisa',
    }
    expect(formatSingleRow(result)[0]["First Name"]).toEqual('Lisa');
    expect(formatSingleRow(result)[0]["Last Name"]).toEqual('');
  })
  describe('when partner result', () => {
    test('it will remove 1 in partner email if they share the email', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'joebob1@email.com',
      }
      const {
        'Partner Email': partnerEmail,
        'Partner Member': mainPartner,
        'Primary Email': Email,
        ...rest
      } = result;
      const outcome = [
        {
          ...rest,
          'Primary Email': Email,
          'Partner Member': mainPartner,
          'First Name': 'Joe',
          'Last Name': 'Bob',
          'emailModified': '',
        },
        {
          'BRN': result['BRN'],
          'Primary Email': Email,
          'First Name': 'Sally',
          'Last Name': 'Bob',
          'Partner Member': result['Primary Member'],
          'Primary Member': result['Partner Member'],
          'emailModified': '+',
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
        'Primary Email': Email,
        ...rest
      } = result;
      const outcome = [
        {
          ...rest,
          'Primary Email': Email,
          'Partner Member': mainPartner,
          'First Name': 'Joe',
          'Last Name': 'Bob',
          'emailModified': '',
        },
        {
          'BRN': result['BRN'],
          'Primary Email': Email,
          'First Name': 'Sally',
          'Last Name': 'Bob',
          'Partner Member': result['Primary Member'],
          'Primary Member': result['Partner Member'],
          'emailModified': '+',
        }
      ]
      expect(formatSingleRow(result)).toEqual(outcome)
    })

    test('it will add plus to emailModified column if partner email modified', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'joebob+@email.com',
      }
      const {
        'Partner Email': partnerEmail,
        'Partner Member': mainPartner,
        'Primary Email': Email,
        ...rest
      } = result;
      const outcome = [
        {
          ...rest,
          'Primary Email': Email,
          'Partner Member': mainPartner,
          'First Name': 'Joe',
          'Last Name': 'Bob',
          'emailModified': '',
        },
        {
          'BRN': result['BRN'],
          'Primary Email': Email,
          'First Name': 'Sally',
          'Last Name': 'Bob',
          'Partner Member': result['Primary Member'],
          'Primary Member': result['Partner Member'],
          'emailModified': '+',
        }
      ]
      expect(formatSingleRow(result)).toEqual(outcome)
    })

    test('it will not add plus plus to emailModified column if partner email is not modified', () => {
      const result = {
        ...baseResult,
        'Partner Email': baseResult['Primary Email'],
      }
      const {
        'Partner Email': partnerEmail,
        'Partner Member': mainPartner,
        'Primary Email': Email,
        ...rest
      } = result;
      const outcome = [
        {
          ...rest,
          'Primary Email': Email,
          'Partner Member': mainPartner,
          'First Name': 'Joe',
          'Last Name': 'Bob',
          'emailModified': '',
        },
        {
          'BRN': result['BRN'],
          'Primary Email': Email,
          'First Name': 'Sally',
          'Last Name': 'Bob',
          'Partner Member': result['Primary Member'],
          'Primary Member': result['Partner Member'],
          'emailModified': '',
        }
      ]
      expect(formatSingleRow(result)).toEqual(outcome)
    })

    test('it will not remove 1 if emails are different', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'sallybob1@email.com',
      }
      expect(formatSingleRow(result)[1]['Primary Email']).toEqual('sallybob1@email.com')
    })

    test('it will not remove + if emails are different', () => {
      const result = {
        ...baseResult,
        'Partner Email': 'sallybob+@email.com',
      }
      expect(formatSingleRow(result)[1]['Primary Email']).toEqual('sallybob+@email.com')
    })
  })
})
