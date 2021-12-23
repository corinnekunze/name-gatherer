export const findNamePieces = (name: string) => {
  const namePieces = name.split(' ');
  return {
    firstName: namePieces[0],
    lastName: namePieces[namePieces.length - 1]
  };
}
