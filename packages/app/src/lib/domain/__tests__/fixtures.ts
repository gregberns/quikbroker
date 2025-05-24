import type { InvitationEntity, InvitationConfig } from '../invitations';

export const mockBrokerEntity: InvitationEntity = {
  id: 1,
  name: 'Test Broker',
  email: 'broker@example.com',
  owner_user_id: 123,
};

export const mockCarrierEntity: InvitationEntity = {
  id: 2,
  name: 'Test Carrier',
  email: 'carrier@example.com',
  owner_user_id: null,
};

export const mockBrokerEntityWithoutUser: InvitationEntity = {
  id: 3,
  name: 'Broker Without User',
  email: 'broker-no-user@example.com',
  owner_user_id: null,
};

export const brokerInvitationConfig: InvitationConfig = {
  entityType: 'broker',
  requiresUserAssociation: true,
  taskIdentifier: 'broker_email_invite',
  emailField: 'email',
};

export const carrierInvitationConfig: InvitationConfig = {
  entityType: 'carrier',
  requiresUserAssociation: false,
  taskIdentifier: 'carrier_email_invite',
  emailField: 'email',
};

export const mockSession = {
  id: 'user123',
  role: 'admin',
};

export const mockRequest = {
  url: '/api/test',
} as any;

export const mockUserInvite = {
  id: 1,
  token: 'mock-token-123',
  user_id: 123,
  expires_at: new Date('2024-01-01'),
};

export const mockJob = {
  id: 1,
  task_identifier: 'broker_email_invite',
  payload: { user_invite_id: 1 },
};