import pino from "pino";

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

export { logger };