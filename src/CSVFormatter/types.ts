export type CSVParseResults = {
  data: CSVResult[];
  errors: string[];
  meta: unknown;
}

export type CSVResult = {
  'Primary Email': string;
  'Primary Member': string;
  'Partner Member': string;
  'Partner Email': string;
  'BRN': string;
  // many more fields here
}

export type FormattedCSVResult = Omit<CSVResult, 'Partner Email'> & {
  'First Name': string;
  'Last Name': string;
}
