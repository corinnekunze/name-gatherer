import Papa from 'papaparse';
import CSVFormatterError from './error';
import { formatRows } from './rowFormatter';
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

  private static parse = async (file: File) => {
    const results = await this.parseFile(file);
    if (results.errors.length) {
      throw new CSVFormatterError('Something went wrong')
    }
    return formatRows(results.data);
  };

  private static unParse = (results: Object[]): string => {
    return Papa.unparse(results, { header: true });
  };
}
