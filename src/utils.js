export const isServer = () => !(typeof window !== "undefined");

class StyleLoadResult {
  isServer = false;
  css = "";
}

const loadStylesSync = (urls = []) => {
  const loadResult = new StyleLoadResult();
  const server = isServer();

  if (server) {
    for (const url of urls) {
      loadResult.css += `@import url('${url}');`;
    }
    loadResult.isServer = true;
    return loadResult;
  }

  for (const url of urls) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    loadResult.css += xhr.responseText;
  }

  return loadResult;
};
/**
 *
 * @returns {StyleLoadResult} CSS stylesheets as strings
 */
export const getGlobalStylesSync = () => {
  const urls = [
    `https://assets.finn.no/pkg/@warp-ds/css/v2/resets.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v2/components.css`,
  ];
  return loadStylesSync(urls);
};

const loadStyles = async (urls = []) => {
  const loadResult = new StyleLoadResult();
  const server = isServer();

  if (server) {
    for (const url of urls) {
      loadResult.css += `@import url('${url}');`;
    }
    loadResult.isServer = true;
    return loadResult;
  }

  const requests = await Promise.all(
    urls.map((url) => fetch(url))
  );

  const cssResult = await Promise.all(
    requests.map((response) => response.text())
  );

  for (const sheet of cssResult) {
    loadResult.css += sheet;
  }

  return loadResult;
};
/**
 *
 * @returns {Promise<StyleLoadResult>} CSS stylesheets as strings
 */
export const getGlobalStyles = async () => {
  const urls = [
    `https://assets.finn.no/pkg/@warp-ds/css/v2/resets.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v2/components.css`,
  ];
  return loadStyles(urls);
};
