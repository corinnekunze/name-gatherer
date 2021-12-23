export type CSVParseResults = {
  data: CSVResult[];
  errors: string[];
  meta: unknown;
}

export type CSVResult = {
  'Email': string;
  'Member': string;
  'Partner Member': string;
  'Partner Email': string;
  'Big Red Numbers': string;
  // many more fields here
}

export type FormattedCSVResult = Omit<CSVResult, 'Partner Email'> & {
  'First Name': string;
  'Last Name': string;
}
