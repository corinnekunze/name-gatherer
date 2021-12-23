import { CSVResult, FormattedCSVResult } from "./types";
import { findNamePieces } from "./utilities";

export const buildMemberRow = (result: CSVResult) => {
  const { 'Partner Email': partnerEmail, ...restResult } = result;
  const namePieces = findNamePieces(result.Member)
  return  {
    ...restResult,
    "First Name": namePieces.firstName,
    "Last Name": namePieces.lastName
  }
}

const buildPartnerRow = (result: CSVResult) => {
  const partnerNamePieces = findNamePieces(result['Partner Member'])
  const {
    Member,
    Email,
    'Partner Member': partnerMember,
    'Partner Email': partnerEmail,
    ...otherResults
  } = result;
  return {
    ...otherResults,
    Email: result['Partner Email'],
    Member: result['Partner Member'],
    "Partner Member": result.Member,
    "First Name": partnerNamePieces.firstName,
    "Last Name": partnerNamePieces.lastName
  }
}

const formatSingleRow = (result: CSVResult) => {
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
