- Registration: registers the user with the verification token, which is sent to email.
- Login: log in Credentials user with two-factor authentication or not, and log in with OAuth(GitHub, Google).
- Create a server route to show how the server component and the server action work.
- Create a client route to show how the client component and the fetching API work.
- Create an admin route to show how to block the user in the front-end (block with RoleGate component) and back-end (block with server action and fetching API)
- Setting:
    + Change the credentials user information with two-factor authentication (name, phone, email, role, password, and can be able to turn on or off 2FactorAuthentication for user )
    + Change the OAuth user information (name, phone, role)
      
## Demo
Link [https://next-auth-postgresql-deploy.vercel.app/]

## Learn More
- Front-end:
    + Nextjs 14
    + Authjs v5 (https://authjs.dev/getting-started/migrating-to-v5)
- Back-end: Prisma ORM
- Database: PostgreSQL 16
- Libs:
    + UI: Shadcn/UI
    + Send an email: Resend
