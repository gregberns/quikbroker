
## Bugs

[x] Currently, when I land on dashboard/admin/brokers, and am not authenticated, the page just shows "Failed to load brokers. Please try again later.". When a user lands on ANY page under `dashboard` they need to be authenticated - if they are not, they should be re-directed to the signin page.

[] Login Exception - When logging in, there's an error in what appears to be the logging service. In this document's "Logging" section, it talks about doing proper logging. Lets start bu getting proper logging set up. Then we need to look at why this is failing. It looks like the login doesnt work because I supplied the new password, and that migration has not been applied to the database.

```
Login error: Error: Attempted to call logErrorToServer() from the server but logErrorToServer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.
    at <unknown> (.next/server/app/api/login/route.js:81:20)
    at POST (src/app/api/login/route.ts:35:23)
  33 |     if (!passwordMatch) {
  34 |       // Log failed login attempts (for security monitoring)
> 35 |       logErrorToServer({
     |                       ^
  36 |         type: "security-warning",
  37 |         message: "Failed login attempt",
  38 |         email: email,
```

## Landing/Signup

[] On the signup screen and home screen's "Get Started Today" email box, make sure in both places you're capturing any and all utm and marketing data and sending it back to the server in the signup call.

## Carrier Management

[] On the Admin Carrier Management screen (dashboard/admin/carriers) when the "Add New Carrier" button is clicked, the modal pops up, around the modal the background is transparent, but the actual modal background is also transparent - which makes it look really funny. I'd assume the background of the modal is supposed to be white.
Also, the phone number field is not using a proper phone number mask - so you can enter any character.

[] The Admin Carrier Detail screen (dashboard/admin/carriers/1) doesn't appear to exist. I thought it had been built - apparently not. Lets get that built out. There should be a similar one for Brokers and Users.

[] Lets make sure the Admin Broker and User Detail screens (dashboard/admin/brokers/1)(dashboard/admin/users/1) have been updated with the new styling.

## Broker Management

[] On the Admin's Broker Management screen (dashboard/admin/brokers), when you click on the 'Edit' button, it just opens an alert. On the Broker Detail screen (dashboard/admin/brokers/1) there is an edit button, and it correctly opens to the Edit screen.

## System Operation

### Logging

[] We had initially added logging in to track what was going on - but we had the logging go to the database, which isn't the right place. Lets build out a conventional logging system. At some point, I'd like all errors both API and NextJs handled errors to flow into a central location, and allow an AI Agent to triage the errors, identify fixes, and create pull requests with the fix.

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
