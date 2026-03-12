const mapToDTO = <T>(data: any, dtoClass: new () => T): T => {
  const dtoInstance = new dtoClass();
  for (const key in dtoInstance) {
    if (data.hasOwnProperty(key)) {
      console.log(`Mapping property: ${ key} with value: ${data[key]}`);
      dtoInstance[key] = data[key];
    }
  }
  return dtoInstance;
};

export default mapToDTO;
