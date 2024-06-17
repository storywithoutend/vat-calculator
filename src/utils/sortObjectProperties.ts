export const sortObjectProperties = (obj: Record<string, any>) =>{
  return Object.fromEntries(Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)))
}