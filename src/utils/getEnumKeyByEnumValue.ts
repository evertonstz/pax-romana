function getEnumKeyByEnumValue<T extends Record<string, string>>(
  myEnum: T,
  enumValue: string,
): keyof T | null {
  const keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}

export { getEnumKeyByEnumValue };
