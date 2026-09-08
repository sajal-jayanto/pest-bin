import pino from "pino";


const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const transportOption = {
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "HH:MM:ss",
    ignore: "pid,hostname",
    singleLine: true,
  },
};

const logger = pino({
  level: Deno.env.get("NODE_ENV") === "development" ? "debug" : "info",
  transport: Deno.env.get("NODE_ENV") === "development" ? transportOption : undefined,
});

const randomString = (length = 16) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const rendPos = Math.random() * chars.length;
    const char = chars.charAt(Math.floor(rendPos));
    result += char;
  }
  return result;
}

export { logger, randomString };