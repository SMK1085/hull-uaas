import { hull_connector_v1 } from "../definitions/hull/hull-connector-v1";

export const NORMALIZATION_AVAILABLEMETHODS: hull_connector_v1.Schema$OptionItem[] = [
  {
    value: "COUNTRY_NAME_COMMON",
    label: "Common Country Name",
  },
  {
    value: "COUNTRY_NAME_OFFICIAL",
    label: "Official Country Name",
  },
  {
    value: "COUNTRY_CODE_CCA2",
    label: "2-letter ISO Country Code",
  },
  {
    value: "COUNTRY_CODE_CCA3",
    label: "3-letter ISO Country Code",
  },
  {
    value: "LINKEDIN_URL",
    label: "LinkedIn Url",
  },
  {
    value: "FACEBOOK_URL",
    label: "Facebook Url",
  },
  {
    value: "TWITTER_URL",
    label: "Twitter Url",
  },
  {
    value: "PHONE_INTERNATIONAL",
    label: "Phone (International Format)",
  },
];
