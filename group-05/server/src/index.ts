import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";
import { startCleanupJob } from "./jobs/cleanup.job.js";
import { startReminderJob } from "./jobs/reminder.job.js";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "GTGS API listening");
  if (env.NODE_ENV !== "test") {
    startReminderJob();
    startCleanupJob();
  }
});
