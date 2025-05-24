
## Bugs


- [ ] Invite Carrier Rest Endpoint

```
 POST /api/carriers/1/invite 500 in 89ms
Invitation sent to carrier: Carrier Person Name (carrier1@test.com)
Error sending invitation: error: relation "carriers" does not exist
    at async POST.requiredRole (src/app/api/carriers/[id]/invite/route.ts:61:8)
  59 |         // Update the carrier record to indicate an invitation was sent
  60 |         const timestamp = new Date();
> 61 |         await db
     |        ^
  62 |           .update(
  63 |             // Using string directly because of schema issues
  64 |             "carriers" as unknown, {
  length: 106,
  severity: 'ERROR',
  code: '42P01',
  detail: undefined,
  hint: undefined,
  position: '8',
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'parse_relation.c',
  line: '1449',
  routine: 'parserOpenTable'
}
```


## Best Practices

[] Build out best practices - Components in `src/components` should not have hard coded paths/urls/hrefs/ect. This will allow them to be reused more reliably in the future. Also if there is hard coded text that is specific to this project, application, business, the text should be passed in via convention. First decide on a proper convention, then document it so we dont forget, then update the components. 

## Deployment


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


### Logging


### Database Migration system

[] The current database migration system doesn't seem to be working well for us. Lets use an industry standard tool and build out a new database schema migration tool. We should also lok at adding commands that will allow an AI to run the migrations so the system is ready for testing. Additionally when building this out, please consider how the migrations will get run when its deployed to production. 

### HTML/CSS/Images/SVG

[] In `src/app/login/page.tsx` there is a SVG object being used directly. Lets get it moved into a reusable, then reference the components instead. Lets update out best practices document to reflect proper handling of SVGs. Then search for other uses of SVG and make sure any use follows best practices.
