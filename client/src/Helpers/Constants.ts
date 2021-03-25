export let FTP_BASE_URL = `http://localhost:4050/`;

export let SERVER_BASE_URL = `http://localhost:4050/`;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  SERVER_BASE_URL = `http://localhost:4050/`;
  FTP_BASE_URL = `http://localhost:4050/`;
} else {
  SERVER_BASE_URL = `https://agile-dusk-06055.herokuapp.com/`;
  FTP_BASE_URL = `https://agile-dusk-06055.herokuapp.com/`;
}
