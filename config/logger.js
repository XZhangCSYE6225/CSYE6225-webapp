import { createLogger, transports, format } from "winston";

const newFormat = format.combine(format.timestamp(), format.json(), format.printf((info) => {
    const log = `${info.timestamp} - [${info.level}]: ${JSON.stringify(info.message)}`
    return log
}))

const logger = createLogger({
    format: newFormat,
    transports: [
        new transports.File({
            filename: "./logs/app.log",
            level: "info"
        })
    ]
});

export default logger