import { CSVResult, FormattedCSVResult } from "./types";
import { findNamePieces } from "./utilities";

export const buildMemberRow = (result: CSVResult) => {
  const { 'Partner Email': partnerEmail, ...restResult } = result;
  const namePieces = findNamePieces(result.Member)
  return  {
    ...restResult,
    "First Name": namePieces.firstName,
    "Last Name": namePieces.lastName,
    emailModified: ''
  }
}

const determinePartnerEmail = (result: CSVResult): { partnerEmail: string; isModified: boolean } => {
  const mainEmailName = result.Email.split('@')[0];
  const partnerEmailName = result['Partner Email'].split('@')[0]
  if (partnerEmailName.includes(mainEmailName)) {
    const isModified = partnerEmailName !== mainEmailName;
    return { partnerEmail: result.Email, isModified };
  }
  return { partnerEmail: result['Partner Email'], isModified: false };
}

const buildPartnerRow = (result: CSVResult) => {
  const partnerNamePieces = findNamePieces(result['Partner Member'])
  const {partnerEmail, isModified} = determinePartnerEmail(result)
  const {
    Member,
    Email,
    'Partner Member': partnerMemberAlias,
    'Partner Email': partnerEmailAlias,
    ...otherResults
  } = result;
  return {
    ...otherResults,
    Email: partnerEmail,
    Member: result['Partner Member'],
    "Partner Member": result.Member,
    "First Name": partnerNamePieces.firstName,
    "Last Name": partnerNamePieces.lastName,
    emailModified: isModified ? '+' : ''
  }
}

export const formatSingleRow = (result: CSVResult): FormattedCSVResult[] => {
  const memberRecord = buildMemberRow(result);
  if (result['Partner Member'].length !== 0) {
    const partnerRecord = buildPartnerRow(result)
    return [memberRecord, partnerRecord];
  }
  return [memberRecord];
}

export const formatRows = (results: CSVResult[]) => {
  return results.reduce((newArray: FormattedCSVResult[], result) => {
    const resultRecord = formatSingleRow(result)
    const recordNotUnique = newArray.find(
      (existingResult) => existingResult['Big Red Numbers'] === result['Big Red Numbers']
    )
    if (recordNotUnique) {
      return newArray;
    }
    return [...newArray, ...resultRecord];
  }, []);
}
