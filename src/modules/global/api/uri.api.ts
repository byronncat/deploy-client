function getHostingServer(path: string) {
  path = path.startsWith('/') ? path : '/' + path;
  path = '/v1' + path;
  if (process.env.REACT_APP_API_URL)
    return process.env.REACT_APP_API_URL + path;
  else return path;
}

function transformImageCDN(path: string, format: string) {
  const urlParts = path.split('/');

  for (let i = 0; i < urlParts.length; i++) {
    if (urlParts[i].includes('upload')) {
      urlParts[i + 1] = format;
      path = urlParts.join('/');
      break;
    }
  }
  return path;
}

export const uri = {
  getHostingServer,
  transformImageCDN,
};
