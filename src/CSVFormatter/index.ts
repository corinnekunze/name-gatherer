import Papa from 'papaparse';
import { CSVParseResults } from './types';
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
    return results.data.map((result) => (
      {
        "Email": result.Email, 
        "First Name": result.Member.split(' ')[0],
        "Member": result.Member,
      }
    ));
  };

  private static parse = async (file: File) => {
    const results = await this.parseFile(file);
    return this.formatWithKnownRows(results);
  };

  private static unParse = (results: Object[]): string => {
    return Papa.unparse(results, { header: true });
  };
}
