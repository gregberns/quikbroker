

# Tasks

* [x] Add Brokerage Name

Email: admin@quikbroker.com
Password: ohbixmmmoicomrgd1400 (see ADMIN_CREDENTIALS.md for details)

## Admin Login

* [x] Tom logs in
* [x] Tom sends an Invite Email to a 'broker'
* [x] Broker clicks the link
* [x] Broker is logged into site

## Stuff

* User is logged in as a known user
  * Probably will be a broker
* User clicks on a link
  * User will be an 'associated' user - we haven't verified their identity - but we know they're authorized
  * When they click a link, they get a session token (which tracks context data)

## Workflow - Broker Login and Creates 'Thing'

* Broker logs in. 
* Enter M Number.
* Add as vendor and send email to the default email.
  * Fetch all their current info. 
  * Add that carrier relation to the brokers list. 

## Workflow - Carrier recievies 'Thing' and Responds

* Carrier gets email with link.
* Link automatically auths the user and marks the email as validated. 
* The carrier can see the brokers request. 
* Complete building out the relationship (figure out the name)


## Future

* Remove Qwick Logos

### Admin Screen

* List of Brokers
  * Carriers of Broker
* List of Carriers
  * Brokers of Carrier

