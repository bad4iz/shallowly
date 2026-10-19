# Changelog

## 1.1.2 (unreleased)

### Fixed

- Restore the `ReactNode` input type for `shallow` and the wrapper constructor in
  generated TypeScript declarations. Calls such as `shallow('Loading')`,
  `shallow(0)`, and `shallow(null)` compile again, matching the existing runtime
  behavior.
