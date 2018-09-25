export function EnumToArray(enumVar: any): string[] {
  return Object.keys(enumVar).map(key => enumVar[key]);
}