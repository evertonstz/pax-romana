function getEnumKeyByEnumValue<T>(
  enumType: T,
  value: string | number,
): T[keyof T] | undefined {
  for (const key in enumType) {
    if (enumType[key] === value) {
      return enumType[key as keyof T];
    }
  }
  return undefined;
}

export { getEnumKeyByEnumValue };
