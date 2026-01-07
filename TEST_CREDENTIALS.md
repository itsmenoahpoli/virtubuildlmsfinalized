### Test Credentials (Seeded Users)

These are the demo accounts created by the database seed process. All accounts are enabled by default.

- **Default password (all accounts)**: `Password123!`

### Student Accounts
- `john.doe@student.com`
- `jane.smith@student.com`
- `mike.johnson@student.com`
- `sarah.wilson@student.com`
- `alex.brown@student.com`

### Instructor Accounts
- `emily.davis@instructor.com`
- `robert.miller@instructor.com`

### Admin Account
- `admin@virtubuild.com`

### Notes
- Seeding is orchestrated by `virtubuild-api/src/seed/index.ts` and creates roles (`student`, `instructor`, `admin`) before users.
- Passwords are stored hashed at rest; the plaintext above is for sign-in during local development/testing.

