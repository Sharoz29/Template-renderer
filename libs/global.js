export const pegaBaseUrl = "https://web.pega23.lowcodesol.co.uk";
export function hostUrl(server) {
  return process.env.node_env === "production" || server === "web"
    ? pegaBaseUrl
    : "http://localhost:3000";
}
