import splitter from 'full-name-splitter';

export const findNamePieces = (name: string) => {
  const namePieces = splitter(name);
  return {
    firstName: namePieces[0],
    lastName: namePieces[namePieces.length - 1]
  };
}
