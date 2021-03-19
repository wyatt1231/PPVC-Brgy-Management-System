export const APP_NAME: any = process.env.REACT_APP_NAME;

export const getAccessToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).access_token;
    }
  } catch (error) {}

  return token;
};

export const getRefreshToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).refresh_token;
    }
  } catch (error) {}

  return token;
};

export const removeToken = () => {
  localStorage.removeItem(APP_NAME);
};
