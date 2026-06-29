# Security Specification: Tassia Pro Sports Portal

This document outlines the security specifications and access control rules for the Tassia Pro Firestore collections.

## 1. Data Invariants

- **Users**: A user's profile must belong exclusively to them. Nobody except the verified user or an administrator should be able to update their user info or password hashes.
- **Application State**: The shared grassroots sports state contains tournament details, teams, players, and match fixtures. Fans (unauthenticated or authenticated) have read-only access to view live matches and reports, while authenticated organizers and managers have permissions to update state records.

## 2. The "Dirty Dozen" Payloads (Denial Tests)

1. **Self-Promote to Admin**: Modifying a profile to elevate a user's role without authorization.
2. **PII Data Scraping**: Trying to query other users' PII data like `email` or `passwordHash` as a generic viewer.
3. **Ghost Writes**: Modifying database states anonymously or injecting unauthorized document properties.
4. **ID Poisoning**: Injecting massive character sequences (> 128 chars) as user or state IDs.
5. **Overwrite Sibling Profiles**: User `A` attempting to write to `users/B`.
6. **Bypass State Logic**: Elevating or modifying fields that are supposed to be protected or system-managed.
7. **Invalid Type Injection**: Writing a non-string or oversized string to user profile keys.
8. **Orphaned State Generation**: Attempting to set database state attributes without a session timestamp.
9. **Spamming Operations**: Rapid write bursts of non-essential attributes.
10. **Unverified User Profile Writes**: Bypassing email verification checks to write verified user records.
11. **Shadow Update on Fields**: Modifying immutable attributes such as `createdAt`.
12. **Blanket Query Scraping**: Attempting to read lists of all users in bulk.

## 3. Recommended Firestore Rules Configuration

The `firestore.rules` file enforces these invariants by constraining read/write access and validating the data schema on the server side.
