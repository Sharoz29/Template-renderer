// export const pegaBaseUrl = "https://web.pega23.lowcodesol.co.uk";
export const pegaBaseUrl = process.env.INGRESSURL;
export function hostUrl(type) {
  return type === "pdf" ? "http://localhost:3000" : pegaBaseUrl;
}

/**
 * @param {string} text text to return
 * @param {string} color enums: [black, red, green, yellow, blue, magenta, cyan, white]
 * @returns colored text
 */
export const coloredText = (text, color = "black") => {
  const colors = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    console_color: "\x1b[0m",
  };
  const coloredText = `${colors[color]}${text}${colors.console_color}`;
  return coloredText;
};
