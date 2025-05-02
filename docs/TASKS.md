
## Bugs


## Deployment

[] HIGH PRIORITY - Running `docker compose build app` to build the web application is now failing. Please look through the docker-compose in the root and `packages/app/Dockerfile` to see what might be going on. It was working before, so I don't think it should require a significant change. The error is below:

```
 => ERROR [app builder 6/6] RUN cd packages/app && yarn build                                                                      5.3s
------
 > [app builder 6/6] RUN cd packages/app && yarn build:
0.207 yarn run v1.22.22
0.228 $ next build
0.585    ▲ Next.js 15.3.0
0.585    - Environments: .env.production, .env
0.585    - Experiments (use with caution):
0.585      ✓ typedRoutes
0.585
0.657    Creating an optimized production build ...
5.233 Failed to compile.
5.233
5.233 ./src/app/dashboard/admin/brokers/page.tsx
5.233 Module not found: Can't resolve '@/components/ui/button'
5.233
5.233 https://nextjs.org/docs/messages/module-not-found
5.233
5.233 ./src/app/dashboard/admin/brokers/page.tsx
5.233 Module not found: Can't resolve '@/components/ui/input'
5.233
5.233 https://nextjs.org/docs/messages/module-not-found
5.233
5.233 ./src/app/dashboard/admin/brokers/page.tsx
5.233 Module not found: Can't resolve '@/components/ui/label'
5.233
5.233 https://nextjs.org/docs/messages/module-not-found
5.233
5.233 ./src/app/dashboard/admin/brokers/page.tsx
5.233 Module not found: Can't resolve '@/components/ui/card'
5.233
5.233 https://nextjs.org/docs/messages/module-not-found
5.233
5.233 ./src/app/dashboard/admin/brokers/page.tsx
5.233 Module not found: Can't resolve '@/components/ui/dashboard/data-table'
5.233
5.233 https://nextjs.org/docs/messages/module-not-found
5.233
5.235
5.235 > Build failed because of webpack errors
5.250 error Command failed with exit code 1.
5.250 info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
------
failed to solve: process "/bin/sh -c cd packages/app && yarn build" did not complete successfully: exit code: 1
```


## Broker Dashboard

[] When a broker logs in (/dashboard/brokers/2), their dashboard has "Total Carriers", "Pending Invitiations", and "Compliance Rate". Those components are not actually wired up to real data. The "Total Carriers" should be easy to wire up. Lets remove "Compliance Rate" since I'm not even sure how that will be calculated. 

## Landing/Signup

[] On the signup screen and home screen's "Get Started Today" email box, make sure in both places you're capturing any and all utm and marketing data and sending it back to the server in the signup call.

## Login Page

[] On the Login page, the tab order of the credentials fields should be "Email", "Password", "Forgot Password?", so tabbing works as a user would expect.

## Carrier Management

[] On the Admin Carrier Management screen (dashboard/admin/carriers) when the "Add New Carrier" button is clicked, the modal pops up, around the modal the background is transparent, but the actual modal background is also transparent - which makes it look really funny. I'd assume the background of the modal is supposed to be white.
Also, the phone number field is not using a proper phone number mask - so you can enter any character.

[] The Admin Carrier Detail screen (dashboard/admin/carriers/1) doesn't appear to exist. I thought it had been built - apparently not. Lets get that built out. There should be a similar one for Brokers and Users.

[] Lets make sure the Admin Broker and User Detail screens (dashboard/admin/brokers/1)(dashboard/admin/users/1) have been updated with the new styling.

## Broker Management

[] On the Admin's Broker Management screen (dashboard/admin/brokers), when you click on the 'Edit' button, it just opens an alert. On the Broker Detail screen (dashboard/admin/brokers/1) there is an edit button, and it correctly opens to the Edit screen.


## Admin Dashboard

[] (Low Priority) - The panels containing "Total Brokers", "Total Carriers", and "Total Users" is a super cool idea, but the data is made up. At some point we'll want to fix that up.

## Technical Considerations, Best Practices

### React

[x] React Routing and Paths - In `src/app/login/page.tsx`, the page changes are occuring through direct dom access `window.location.href = '/dashboard';`. I'm not positive, but I don't think this is a React best practice. If its not, lets figure out what the best practice is, then document it so future runs will conform to the best practices. Then fix any places that pattern is being followed. Also, referring to the route directly via string '/dashboard' I don't believe is a sustainable way of managing routing as this app grows larger. Lets build some best practes around route management, document them, them update any locations using improper patterns.

[x] Code cleanup - Remove legacy session cookie handling and standardize on JWT-based auth

### Logging

[x] We had initially added logging in to track what was going on - but we had the logging go to the database, which isn't the right place. Lets build out a conventional logging system. At some point, I'd like all errors both API and NextJs handled errors to flow into a central location, and allow an AI Agent to triage the errors, identify fixes, and create pull requests with the fix.

```
Error while logging client error: error: relation "app_private.error_logs" does not exist
    at async POST (src/app/api/log-error/route.ts:19:6)
  17 |     try {
  18 |       // Insert the error log
> 19 |       await client.query(
     |      ^
  20 |         `INSERT INTO app_private.error_logs
  21 |          (error_type, message, stack, component_stack, url, user_agent, client_timestamp, metadata)
  22 |          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, {
```

### Database Migration system

[] The current database migration system doesn't seem to be working well for us. Lets use an industry standard tool and build out a new database schema migration tool. We should also lok at adding commands that will allow an AI to run the migrations so the system is ready for testing. Additionally when building this out, please consider how the migrations will get run when its deployed to production. 

### HTML/CSS/Images/SVG

[] In `src/app/login/page.tsx` there is a SVG object being used directly. Lets get it moved into a reusable, then reference the components instead. Lets update out best practices document to reflect proper handling of SVGs. Then search for other uses of SVG and make sure any use follows best practices.
