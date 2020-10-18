# Hull Unification-as-a-Service

This Connector enables you to run various unification strategies on your data in Hull.

> This connector is under active development, features are subject to change and the documentation might not be complete yet.

## Unification

There are multiple strategies you can use to unify attributes in Hull. This connector enables you to easily select the sources, a potential normalization method (see section Normalization for details.) and let the connector handle the rest.

The following strategies are available

- Priority
- Last Changed
- Quorum

Please refer to the sections below for further details.

### Priority

_This feature is not available yet._

### Last Changed

_This feature is not available yet._

### Quorum

The quorum strategy employs a simple majority pattern to determine the value of the unified attribute.

Let's look at an example, assuming we want to create a unified attribute for the country code of accounts.
In this example we have Clearbit, Salesforce and Hubspot data as shown below:

| Source Attribute        | Source Value |
| ----------------------- | ------------ |
| `clearbit/country_code` | `US`         |
| `salesforce/country`    | `Germany`    |
| `hubspot/country_code`  | `DEU`        |

We apply the `2-letter ISO Country Code` normalization to those source values, which yields the following result:

| Source Attribute        | Source Value | Normalized Value |
| ----------------------- | ------------ | ---------------- |
| `clearbit/country_code` | `US`         | `US`             |
| `salesforce/country`    | `Germany`    | `DE`             |
| `hubspot/country_code`  | `DEU`        | `DE`             |

The simple majority checks whether one normalized value occurs more often than 50% in all sources.
In our example the calculation looks as follows:

| Normalized Value | Count | Percentage |
| ---------------- | ----- | ---------- |
| `US`             | 1     | 33%        |
| `DE`             | 2     | 67%        |

Since the percentage of `DE` is greather than 50%, the attribute `unified/country_code` will be set to `DE` and the attribute `unified/country_code_confidence` will be set to `67`. The Quorum pattern not only provides you with the value itself, but also with a confidence indicator which you can use to determine for example a data quality score or for segmentation purposes.

If we modify the example above and assume that we don't have data from Salesforce, we would have a tie:

| Source Attribute        | Source Value | Normalized Value |
| ----------------------- | ------------ | ---------------- |
| `clearbit/country_code` | `US`         | `US`             |
| `salesforce/country`    | `null`       | n/a              |
| `hubspot/country_code`  | `DEU`        | `DE`             |

| Normalized Value | Count | Percentage |
| ---------------- | ----- | ---------- |
| `US`             | 1     | 50%        |
| `DE`             | 1     | 50%        |

In this case the attribute `unified/country_code` will be set to `null` (essentially unsetting it) and the attribute `unified/country_code_confidence` will be set to `0`. The reason for that is that we cannot or can no longer determine a value which fulfills the criteria of a simple majority.

## Normalization

### No normalization

Select this option if you want to run the unification on the source values as-is.

### Common Country Name

The common country name normalization returns the common country name in English for inputs which are either one of the following

- a CCA2 code (ISO 3166-1 alpha-2 country code),
- a CCA3 code (ISO 3166-1 alpha-3 country code),
- a common country name in English or any native language,
- an official country name in English or any native language,

performing a case insensitive lookup.

### Official Country Name

The official country name normalization returns the official country name in English for inputs which are either one of the following

- a CCA2 code (ISO 3166-1 alpha-2 country code),
- a CCA3 code (ISO 3166-1 alpha-3 country code),
- a common country name in English or any native language,
- an official country name in English or any native language,

performing a case insensitive lookup.

### 2-letter ISO Country Code

The 2-letter ISO Country Code normalization returns the CCA2 code for inputs which are either one of the following

- a CCA2 code (ISO 3166-1 alpha-2 country code),
- a CCA3 code (ISO 3166-1 alpha-3 country code),
- a common country name in English or any native language,
- an official country name in English or any native language,

performing a case insensitive lookup.

### 3-letter ISO Country Code

The 3-letter ISO Country Code normalization returns the CCA3 code for inputs which are either one of the following

- a CCA2 code (ISO 3166-1 alpha-2 country code),
- a CCA3 code (ISO 3166-1 alpha-3 country code),
- a common country name in English or any native language,
- an official country name in English or any native language,

performing a case insensitive lookup.

### LinkedIn Url

The LinkedIn Url normalization returns a LinkedIn Url with a uniform format for a potentially valid LinkedIn url.
The normalization checks whether the hostname equals `linkedin.com` and returns a LinkedIn Url with www subdomain and without any trailing slashes.
The following table illustrates some examples:

| Input                                  | Output                                 |
| -------------------------------------- | -------------------------------------- |
| `https://linkedin.com/in/john-doe`     | `https://www.linkedin.com/in/john-doe` |
| `https://linkedin.com/in/john-doe/`    | `https://www.linkedin.com/in/john-doe` |
| `http://www.linkedin.com/in/john-doe/` | `https://www.linkedin.com/in/john-doe` |
| `https://facebook.com/john-doe/`       | _Invalid_                              |
| `in/john-doe`                          | _Invalid_                              |

### Facebook Url

The Facebook Url normalization returns a Facebook Url with a uniform format for a potentially valid Facebook url.
The normalization checks whether the hostname equals `facebook.com` and returns a Facebook Url with www subdomain and without any trailing slashes.
The following table illustrates some examples:

| Input                               | Output                              |
| ----------------------------------- | ----------------------------------- |
| `https://facebook.com/john-doe`     | `https://www.facebook.com/john-doe` |
| `https://facebook.com/john-doe/`    | `https://www.facebook.com/john-doe` |
| `http://www.facebook.com/john-doe/` | `https://www.facebook.com/john-doe` |
| `https://linkedin.com/in/john-doe/` | _Invalid_                           |
| `john-doe`                          | _Invalid_                           |

### Twitter Url

The Twitter Url normalization returns a Twitter Url with a uniform format for a potentially valid Twitter url.
The normalization checks whether the hostname equals `twitter.com` and returns a Twitter Url without a www subdomain and without any trailing slashes.
The following table illustrates some examples:

| Input                               | Output                    |
| ----------------------------------- | ------------------------- |
| `https://twitter.com/aws`           | `https://twitter.com/aws` |
| `https://www.twitter.com/aws`       | `https://twitter.com/aws` |
| `http://www.twitter.com/aws/`       | `https://twitter.com/aws` |
| `https://linkedin.com/in/john-doe/` | _Invalid_                 |
| `john-doe`                          | _Invalid_                 |

## FAQ

### What is the source of the country data

While there are a plenty of sources out there, this connector uses data from an open source repository. Please refer to the following [Website](https://git.io/countries) or [GitHub Repository](https://github.com/mledoze/countries).
