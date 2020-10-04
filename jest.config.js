module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: [
    "/lib/",
    "/node_modules/",
    "/build/",
    "/build-types/",
    "/_data",
    "/_helpers",
    "/_scenarios",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverageFrom: [
    "src/services/**",
    "src/utils/**",
    "!src/middleware/**",
    "!src/definitions",
  ],
};
