export const getEnumKey = enumerator => Object.values(enumerator).filter((v) => typeof (v) === "string")

export const getEnumValue = enumerator => Object.values(enumerator).filter((v) => typeof (v) === "number")