export type CSVParseResults = {
  data: CSVResult[];
  errors: string[];
  meta: unknown;
}

export type CSVResult = {
  Email: string;
  Member: string;
  // many more fields here
}
