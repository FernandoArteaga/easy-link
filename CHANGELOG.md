# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com), and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]


## [1.3.0] - 2025-12-13
### Added
- New component `DisplayTextInline` to standardize inline text.

### Changed
- Don't show the "All" folder option in the folder page since this is not a real folder and cannot be managed.
- Update Firestore indexes.
- Upgrade Skeleton to version 4.
  - Refactor Modal component to use new Skeleton Dialog component.
  - Refactor the Toaster component to use new Skeleton Toast component.
- Update GHA to use latest versions.

### Fixed
- Make the folder tab bar full width when there are few folders to prevent layout issues.

## [1.2.3] - 2025-10-20
### Added
- Create a user document on signup to initialize `totalFolders` field.
- Add `lastLogin` field to the user document that updates on each login.

### Changed
- Simplify folder creation security rules by assuming a user document always exists.
- Unify GHA workflow for tagged releases to a single workflow file.

## [1.2.2] - 2025-10-19
### Changed
- Include in the Firebase workflows a new job to deploy Firestore rules.
- Validate the Firestore rules in PRs to prevent invalid rules from being merged.

### Fixed
- Fixed folder creation security rules that incorrectly denied creation when the actor had no `user` document.

## [1.2.1] - 2025-10-19
### Added
- New page for managing folders.
- Option to assign links to folder.

## [1.2.0] - 2025-10-15
### Added
- Folders feature to organize links.

## [1.1.2] - 2025-04-04
### Changed
- Updated iOS image.

## [1.1.1] - 2025-03-17
### Changed
- Updated dependencies.

## [1.1.0] - 2025-03-11
### Changed
- Hide Links page when the user is not authenticated.

## [1.0.1] - 2025-03-06
### Fixed
- Set max height for LinkChip to improve layout and prevent overflow.

## [1.0.0] - 2025-03-02
### Added
- Initial release of Easy Link.
- Firebase authentication.
- Firestore integration.
- Action buttons for each link.
- External navigation icon shown only for valid links.
- Initial login layout and base application setup.
