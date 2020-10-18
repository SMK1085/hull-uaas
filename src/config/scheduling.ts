import { HullConnectorSchedule } from "../definitions/hull/hull-connector";

export const schedules: HullConnectorSchedule[] = [
  {
    type: "cron",
    url: "/status",
    value: "*/30 * * * *",
  },
];
