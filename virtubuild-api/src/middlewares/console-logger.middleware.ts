import morgan from "morgan";
import chalk from "chalk";

const morganLogger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens["response-time"](req, res);

  const logLine = [
    method,
    url,
    status,
    responseTime ? `${responseTime}ms` : "",
  ].join(" ");

  if (status) {
    if (status.startsWith("4")) {
      return chalk.yellow(logLine);
    } else if (status.startsWith("5")) {
      return chalk.red(logLine);
    }
    return chalk.green(logLine);
  }

  return logLine;
});

export { morganLogger as MorganLoggerMiddleware };
