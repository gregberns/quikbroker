
## General Idea

Were going to combine some ideas into a new framework.

An interface will define the commands that can be executed against the system and the responses expected.

Actors will execute commands on the interface to attempt to make changes against the system.

The first system that will implement the interface is a state machine that will accept the commands, process them which will change the state, and return a response.

Later on, the state machine can be replaced with another system that actually impacts the outside world.

The Actors executing commands can be unit/integration tests, AI Agents, or, later on, a UI or API.

## Data Types

## Actors

Actors in this system are representing external enties that will be taking action from outside the system.

Actors go through a life cycle by executing certain actions:
* Register - the Actor will register so the system is aware of the Actor.
* Claim Broker or Carrier - An action will submit a claim that they are associates with a particular Carrier or Broker ( UnverifiedCarrier or UnverifiedBroker.)
* Verified Broker or Carrier - The Agent have proven they are associated with the Carrier or Broker (VerifiedCarrier or VerifiedBroker.)

Multiple Actors can be associated with a single Broker or Carrier.

### Mailbox and Messages

Each Broker and Carrier will have a "Mailbox" that can contain a list of Messages. Messages received to an inbox can be "Informational" or "Actionable".
Every Message to a Mailbox will have properties: address of the Actor to deliver it to, ExpectedResponse is the purpose of the message: Actionable | Informational. If Actionable, it includes an "Action" which is how the Actor should respond. 
Both actors can perform several actions:

### Broker and Carrier Registry

The BrokerRegistry contains a BrokerPublicIdentfier and Mailbox Address.

The CarrierRegistry contains a CarrierPublicIdentfier and Mailbox Address.

These registries are immutible and are queryable by the PublicIdentifier.

When an Actor claims they are a Broker with a specific PublicIdentifier, access to that Mailbox needs to be verified.

## Tasks

## Actions

* Register - This creates the agent provides their "Mailbox" identifier and whether they are a Broker or Carrier. 
  * Input:
    * Mailbox identifier - an id to send messages to
  * State Change
    * A new "Actor" is added, with a mailbox. The actor will have a property of "MailboxVerification" set to "Unverified", with a stored MailboxVerification Token
    * A Task is added to the Tasks queue in state. The TaskLabel is "SendMessage", and the TaskPayload is a Message, with the Actors Address, ExpectedResponse is Actionable, and Action is 'VerifyMailbox'.
  * Events:
    * NewTaskAdded - triggers the TaskProcessor to run
  * Output:
    * An Actor Identifier and Identity Token are returned. The Actor should persist this information in their State, so it can be sumbitted in "VerifyIdentity" step
* VerifyIdentity - Verifies the Actor is who they say they are
  * Input
    * Identity Token - recieved from the "Register" step
  * Output:
    * Session Token - Allows subsequent calls
* VerifyMailbox - An Actor can submit this action to verify they have access to their Mailbox.
  * Input:
    * Mailbox Verification Token
  * State Change:
    * The Actor's "MailboxVerification" property changes from "Unverified" to "Verified". The stored MailboxVerificationToken is deleted from state 
  * Output:
    * MailboxVerified - 
* CarrierVerification - This will verify that this carrier has access to the Carrier's Mailbox in the Carrier Registry
  * Input:
    * CarrierPublicIdentifier
  * Query
    * Query the Carrier Registry with the CarrierPublicIdentifier, retriving the Mailbox Address
  * State Change
    * Actor is updated to "Claim" they are the Carrier with the supplied Public Identifier. A CarrierClaimIdentifier is created and associated with the Actor.
    * Task added to Task Queue. Task is SendMessage. Message Label is "VerifyCarrierIdentity". Mailbox address queried from the Registry. It is Actionable with Action: ConfirmCarrierIdentity
  * Event:
    * NewTask
* BrokerInvitesCarrier - Initiates a relationship between the Broker and Carrier
  * Permissions: Only callable by a Broker
  * Input:
    * CarrierPublicIdentifier - Identifier known by all Actors
  * State Change
    * BrokerCarrierRelationship is a set of the Broker Identifier and Carrier Identifier and a Status. A new entry will be created, and the status set to "BrokerInitiated"
    * A Task is added to the Task queue. The TaskLabel is "SendBrokerInitiatedMessage", which contains the Broker and Carrer
  * Events
    * NewTask - includes TaskIdentifier and TaskLabel

* Query - Allows an Actor to query the state relevent to that actor.
  * Input: None
  * State Change: None
  * Output: State (Only associated with that actor)

## Commands

Commands are simply Actions with the Actor that is executing the Action.

Each Actor type will have a set of Functions, specific to the Actor type. The Functions will take all the parameters for the Command, and have context of the Actor, generate the Command, and submit the Command.

## Defined Interface

It is critical that the interface is clearly defined so that LLM Models can understand how the interface works.

The functions need to be grouped so an Actor is only aware of the functions they can execute.

All the Function Commands should describe clearly their purpose, inputs, and outputs.


## Actor Turns

The system works in this loop:

* System Initiates
  * Can initiate from a persisted State, or will use a default
* System in 'Open' state - ready to accept requests
  * Actors can submit Commands
* Actor submits Command
* Command Enqueued
  * Its enqued in a way that allows the Actor to know when the Command is completed along with the result
* Command Processed
  * Only one Command can be sumbitted at a time
  * Command Input is validated
    * If there are identifiers that need to be checked, use the Query function to get the state and make sure the Actor has access
  * A set of State changes are computed
    * This is a set of commands that will deterministically alter the state of the application
  * The State changes are applied and a new state results
  * Events Generated
  * Response Returned
* System Loop
  * System will internally process Tasks, Events, etc
* System Dequeues next Command to be processed




