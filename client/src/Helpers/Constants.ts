export let FTP_BASE_URL = `http://localhost:4050/`;

export let SERVER_BASE_URL = `http://localhost:4050/`;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  SERVER_BASE_URL = `http://localhost:4050/`;
  FTP_BASE_URL = `http://localhost:4050/`;
} else {
  SERVER_BASE_URL = `https://infinite-harbor-70124.herokuapp.com/`;
  FTP_BASE_URL = `https://infinite-harbor-70124.herokuapp.com/`;
}
