module.exports = {
    projects: [
        "core/*",
        "plugins/*"
    ],
    reporters: ['default', 'jest-junit'],
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/core/cli/src/index.ts'],
    collectCoverageFrom: ["src/**/*.{js,ts}"],
    coverageReporters: ["text-summary", "lcov"]
};
