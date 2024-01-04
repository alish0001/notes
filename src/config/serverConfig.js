module.exports = {
  port: process.env.PORT || 8080,
  maximumAllowedNoteSize: process.env.MAX_NOTE_SIZE || 10000,
  windowDuration: process.env.WINDOW_DURATION || 1, // 1 seconds
  hitCount: process.env.HIT_COUNT || 5, // default rate limit 5 request per second
  ipRetryTime: process.env.IP_RETRY_TIME || 1, // 1 seconds
  dbUri: process.env.MONGO_DB_URI,
  accessToken: process.env.ACCESS_TOKEN_SECRET,
};
