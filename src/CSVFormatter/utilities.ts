const TITLES = [
  'Dr',
  'Doctor',
  'Mrs',
  'Ms',
]

const firstNameIsTitle = (firstName: string): boolean => {
  return TITLES.some((title) => firstName.includes(title))
}

export const findNamePieces = (name: string) => {
  const namePieces = name.split(' ');
  const firstName = firstNameIsTitle(namePieces[0]) ? namePieces[1] : namePieces[0];
  const lastName = namePieces.length === 1 ? '' : namePieces[namePieces.length - 1];
  return {
    firstName,
    lastName
  };
}
