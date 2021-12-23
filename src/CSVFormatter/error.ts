export default class CSVFormatterError extends Error {
  static NAME = 'CSVFormatterError'
  constructor(message: string) {
    super(message);

    this.name = CSVFormatterError.NAME;
  }
}
