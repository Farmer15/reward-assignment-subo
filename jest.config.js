/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".spec.ts$",
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@apps/(.*)$": "<rootDir>/apps/$1",
    "^@libs/(.*)$": "<rootDir>/libs/$1",
    "^@shared/(.*)$": "<rootDir>/shared/$1",
    "^libs/(.*)$": "<rootDir>/libs/$1",
  },
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};
