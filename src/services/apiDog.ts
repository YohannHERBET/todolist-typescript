export const fetchDogImage = async (): Promise<string> => {
  const response = await fetch("https://api.thedogapi.com/v1/images/search");
  const data = await response.json();
  return data[0].url;
};