const serverConfig = require("../config/serverConfig");
const {
  CustomBadRequestError,
  RateLimitExceedError,
} = require("../lib/errors");
const IpModel = require("./model/validateIpModel");
const getIPAddress = (req) => {
  return (
    (req.headers["x-forwarded-for"] &&
      req.headers["x-forwarded-for"].split(",", 1).pop()) ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip
  );
};

const ipLevelRateLimiting = async (req, res, next) => {
  const reqIpAddress = getIPAddress(req);

  if (!reqIpAddress) {
    throw new CustomBadRequestError("Invalid payload");
  }
  const ipEntry = await IpModel.findOne({
    ipAddress: reqIpAddress,
  });

  if (!ipEntry) {
    const ipDate = {
      ipAddress: reqIpAddress,
      isBlocked: false,
      hitCount: 1,
      createdTime: Date.now(),
    };
    await IpModel.collection.insertOne(ipDate);
  } else {
    const firstAttempt = Math.floor(ipEntry.createdTime / 1000);
    const newRequestAttempt = Math.floor(Date.now() / 1000);
    const timeDifference = newRequestAttempt - firstAttempt;
    const ipHitCount = ipEntry.hitCount + 1;

    const ipRetryTime = serverConfig.ipRetryTime;
    const hitCount = serverConfig.hitCount;
    const windowDuration = serverConfig.windowDuration;
    if (ipEntry.isBlocked && timeDifference > parseInt(ipRetryTime)) {
      // If IP is blocked and retry time has elapsed, unblock and allow the request
      await IpModel.updateOne(
        { $and: [{ ipAddress: reqIpAddress }] },
        { $set: { hitCount: 1, createdTime: Date.now(), isBlocked: false } }
      );
    } else if (
      // If IP is blocked and within the retry time, deny the request
      ipEntry.isBlocked &&
      timeDifference < parseInt(ipRetryTime)
    ) {
      throw new RateLimitExceedError();
    } else if (
      // If IP is not blocked but exceeds hit count within the window, block the IP
      !ipEntry.isBlocked &&
      ipHitCount > parseInt(hitCount) &&
      timeDifference < parseInt(windowDuration)
    ) {
      await IpModel.updateOne(
        { $and: [{ ipAddress: reqIpAddress }] },
        { $set: { isBlocked: true, createdTime: Date.now() } }
      );
      throw new RateLimitExceedError();
    } else if (
      !ipEntry.isBlocked &&
      timeDifference < parseInt(windowDuration) &&
      ipHitCount <= parseInt(hitCount)
    ) {
      // If IP is not blocked, within the window, and within the hit count, increment hit count
      await IpModel.updateOne(
        { $and: [{ ipAddress: reqIpAddress }] },
        { $set: { hitCount: ipHitCount } }
      );
    } else if (
      !ipEntry.isBlocked &&
      timeDifference > parseInt(windowDuration)
    ) {
      // If IP is not blocked, outside the window, reset hit count
      await IpModel.updateOne(
        { $and: [{ ipAddress: reqIpAddress }] },
        { $set: { hitCount: 1, createdTime: Date.now() } }
      );
    }
  }
  next();
};

module.exports = ipLevelRateLimiting;
