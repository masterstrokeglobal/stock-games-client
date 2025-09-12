

export const getStockName = (name: string, codeName: string) => {
  return name && name.length > 8 ? codeName && codeName.length > 8 ? codeName.slice(0, 5)+"..." : codeName : name
}