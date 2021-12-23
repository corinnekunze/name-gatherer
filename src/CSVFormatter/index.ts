import Papa from 'papaparse';
import { CSVParseResults } from './types';
import { findNamePieces } from './utilities';
export default class CSVFormatter {
  static parseAndFormat = async (file: File) => {
    const results = await this.parse(file);
    return await this.unParse(results);
  };

  private static parseFile = async (file: File): Promise<CSVParseResults> => {
    return await new Promise ((resolve) => {
      Papa.parse(file, { header: true, complete: (results: CSVParseResults) => {
        resolve(results);
      }})
    });
  };
  
  private static formatWithKnownRows = (results: CSVParseResults) => {
    return results.data.map((result) => {
      const namePieces = findNamePieces(result.Member)
      return {
        ...result,
        "First Name": namePieces.firstName,
        "Last Name": namePieces.lastName
      }
    });
  };

  private static parse = async (file: File) => {
    const results = await this.parseFile(file);
    return this.formatWithKnownRows(results);
  };

  private static unParse = (results: Object[]): string => {
    return Papa.unparse(results, { header: true });
  };
}
