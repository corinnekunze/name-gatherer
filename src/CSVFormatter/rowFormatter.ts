import { CSVResult, FormattedCSVResult } from "./types";
import { findNamePieces } from "./utilities";

export const buildMemberRow = (result: CSVResult) => {
  const { 'Partner Email': partnerEmail, ...restResult } = result;
  const namePieces = findNamePieces(result['Primary Member'])
  return  {
    ...restResult,
    "First Name": namePieces.firstName,
    "Last Name": namePieces.lastName,
    emailModified: ''
  }
}

const determinePartnerEmail = (result: CSVResult): { partnerEmail: string; isModified: boolean } => {
  const mainEmail = result['Primary Email'];
  const mainEmailName = mainEmail.split('@')[0];
  const partnerEmailName = result['Partner Email'].split('@')[0]
  if (partnerEmailName.includes(mainEmailName)) {
    const isModified = partnerEmailName !== mainEmailName;
    return { partnerEmail: mainEmail, isModified };
  }
  return { partnerEmail: result['Partner Email'], isModified: false };
}

const buildPartnerRow = (result: CSVResult) => {
  const partnerNamePieces = findNamePieces(result['Partner Member'])
  const {partnerEmail, isModified} = determinePartnerEmail(result)
  const {
    'Primary Member': Member,
    'Primary Email': Email,
    'Partner Member': partnerMemberAlias,
    'Partner Email': partnerEmailAlias,
    ...otherResults
  } = result;
  return {
    ...otherResults,
    "Primary Email": partnerEmail,
    "Primary Member": result['Partner Member'],
    "Partner Member": Member,
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
      (existingResult) => existingResult['BRN'] === result['BRN']
    )
    if (recordNotUnique) {
      return newArray;
    }
    return [...newArray, ...resultRecord];
  }, []);
}
