export const arrayDeepDup = <T>(subject: T): T => {
  return JSON.parse(JSON.stringify(subject));
}
