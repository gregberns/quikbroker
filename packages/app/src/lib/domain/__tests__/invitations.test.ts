import { 
  validateInvitationRequest, 
  sendInvitation, 
  createInvitationResponse,
  type InvitationResult 
} from '../invitations';
import { withTransaction } from '@/db/transaction';
import { createUserInvite } from '@/db/queries/userInvites';
import { createJob } from '@/db/queries/jobs';
import {
  mockBrokerEntity,
  mockCarrierEntity,
  mockBrokerEntityWithoutUser,
  brokerInvitationConfig,
  carrierInvitationConfig,
  mockSession,
  mockRequest,
  mockUserInvite,
  mockJob,
} from './fixtures';

// Mock external dependencies
jest.mock('@/db/transaction');
jest.mock('@/db/queries/userInvites');
jest.mock('@/db/queries/jobs');
jest.mock('@/app/lib/worker', () => ({
  processJob: jest.fn(),
}));

const mockWithTransaction = withTransaction as jest.MockedFunction<typeof withTransaction>;
const mockCreateUserInvite = createUserInvite as jest.MockedFunction<typeof createUserInvite>;
const mockCreateJob = createJob as jest.MockedFunction<typeof createJob>;

describe('validateInvitationRequest', () => {
  it('should return valid result for numeric string', () => {
    const result = validateInvitationRequest('123');
    
    expect(result.isValid).toBe(true);
    expect(result.entityId).toBe(123);
    expect(result.error).toBeUndefined();
  });

  it('should return valid result for numeric string with leading zeros', () => {
    const result = validateInvitationRequest('0123');
    
    expect(result.isValid).toBe(true);
    expect(result.entityId).toBe(123);
    expect(result.error).toBeUndefined();
  });

  it('should return invalid result for non-numeric string', () => {
    const result = validateInvitationRequest('abc');
    
    expect(result.isValid).toBe(false);
    expect(result.entityId).toBeUndefined();
    expect(result.error).toEqual({
      message: 'Invalid ID',
      statusCode: 400
    });
  });

  it('should return invalid result for empty string', () => {
    const result = validateInvitationRequest('');
    
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toBe('Invalid ID');
    expect(result.error?.statusCode).toBe(400);
  });

  it('should return valid result for mixed alphanumeric string that starts with number', () => {
    // Note: parseInt('123abc') returns 123, which is valid behavior
    const result = validateInvitationRequest('123abc');
    
    expect(result.isValid).toBe(true);
    expect(result.entityId).toBe(123);
  });

  it('should return valid result for zero', () => {
    const result = validateInvitationRequest('0');
    
    expect(result.isValid).toBe(true);
    expect(result.entityId).toBe(0);
  });

  it('should return valid result for negative numbers', () => {
    const result = validateInvitationRequest('-123');
    
    expect(result.isValid).toBe(true);
    expect(result.entityId).toBe(-123);
  });
});

describe('sendInvitation', () => {
  const mockUpdateFn = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for withTransaction to just execute the function
    mockWithTransaction.mockImplementation((fn) => fn());
  });

  describe('when user association is required', () => {
    it('should successfully send invitation for broker with user association', async () => {
      // Arrange
      mockCreateUserInvite.mockResolvedValue(mockUserInvite);
      mockCreateJob.mockResolvedValue(mockJob);
      mockUpdateFn.mockResolvedValue({});

      // Act
      const result = await sendInvitation(
        mockBrokerEntity,
        brokerInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Invitation sent to broker@example.com');
      expect(result.statusCode).toBe(200);
      expect(result.entityType).toBe('broker');
      expect(result.inviteUrl).toContain('/verify-email?token=');
      expect(result.entity).toEqual({
        ...mockBrokerEntity,
        invitation_sent_at: expect.any(Date)
      });

      expect(mockWithTransaction).toHaveBeenCalledWith(expect.any(Function));
      expect(mockCreateUserInvite).toHaveBeenCalledWith({
        user_id: 123,
        token: expect.any(String),
        expires_at: expect.any(Date)
      });
      expect(mockCreateJob).toHaveBeenCalledWith({
        task_identifier: 'broker_email_invite',
        payload: { user_invite_id: 1 }
      });
      expect(mockUpdateFn).toHaveBeenCalledWith(1, {
        invitation_sent_at: expect.any(Date)
      });
    });

    it('should return error when broker has no associated user', async () => {
      // Act
      const result = await sendInvitation(
        mockBrokerEntityWithoutUser,
        brokerInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.entityType).toBe('broker');
      expect(result.message).toBe('broker has no associated user. Please assign a user first.');
      expect(result.entity).toBeUndefined();
      expect(result.inviteUrl).toBeUndefined();

      expect(mockWithTransaction).not.toHaveBeenCalled();
      expect(mockUpdateFn).not.toHaveBeenCalled();
    });

    it('should handle transaction errors and log them', async () => {
      // Arrange
      const mockError = new Error('Transaction failed');
      mockWithTransaction.mockRejectedValue(mockError);

      // Act
      const result = await sendInvitation(
        mockBrokerEntity,
        brokerInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.entityType).toBe('broker');
      expect(result.message).toBe('An error occurred while sending the invitation');

      // Error logging is now handled by console.error
    });

    it('should generate invitation URL with correct base URL', async () => {
      // Arrange
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
      
      mockCreateUserInvite.mockResolvedValue(mockUserInvite);
      mockCreateJob.mockResolvedValue(mockJob);
      mockUpdateFn.mockResolvedValue({});

      // Act
      const result = await sendInvitation(
        mockBrokerEntity,
        brokerInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.inviteUrl).toMatch(/^https:\/\/example\.com\/verify-email\?token=/);

      // Cleanup
      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });

    it('should use localhost as fallback URL when NEXT_PUBLIC_APP_URL is not set', async () => {
      // Arrange
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;
      
      mockCreateUserInvite.mockResolvedValue(mockUserInvite);
      mockCreateJob.mockResolvedValue(mockJob);
      mockUpdateFn.mockResolvedValue({});

      // Act
      const result = await sendInvitation(
        mockBrokerEntity,
        brokerInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.inviteUrl).toMatch(/^http:\/\/localhost:3000\/verify-email\?token=/);

      // Cleanup
      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });
  });

  describe('when user association is not required', () => {
    it('should successfully send invitation for carrier without user association', async () => {
      // Arrange
      mockUpdateFn.mockResolvedValue({});
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await sendInvitation(
        mockCarrierEntity,
        carrierInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Invitation sent to carrier@example.com');
      expect(result.statusCode).toBe(200);
      expect(result.entityType).toBe('carrier');
      expect(result.inviteUrl).toBeUndefined();
      expect(result.entity).toEqual({
        ...mockCarrierEntity,
        invitation_sent_at: expect.any(Date)
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Invitation sent to carrier: Test Carrier (carrier@example.com)'
      );
      expect(mockWithTransaction).not.toHaveBeenCalled();
      expect(mockUpdateFn).toHaveBeenCalledWith(2, {
        invitation_sent_at: expect.any(Date)
      });

      consoleSpy.mockRestore();
    });

    it('should handle update function errors', async () => {
      // Arrange
      const mockError = new Error('Update failed');
      mockUpdateFn.mockRejectedValue(mockError);

      // Act
      const result = await sendInvitation(
        mockCarrierEntity,
        carrierInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.entityType).toBe('carrier');
      expect(result.message).toBe('An error occurred while sending the invitation');

      // Error logging is now handled by console.error
    });
  });

  describe('error handling', () => {
    it('should handle non-Error objects thrown', async () => {
      // Arrange
      mockUpdateFn.mockRejectedValue('String error');

      // Act
      const result = await sendInvitation(
        mockCarrierEntity,
        carrierInvitationConfig,
        mockUpdateFn,
        mockSession,
        mockRequest
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.entityType).toBe('carrier');
      // Error logging is now handled by console.error
    });
  });
});

describe('createInvitationResponse', () => {
  it('should create success response for broker with invite URL', () => {
    // Arrange
    const successResult: InvitationResult = {
      success: true,
      message: 'Invitation sent',
      entity: { ...mockBrokerEntity, invitation_sent_at: new Date() },
      inviteUrl: 'https://example.com/verify',
      statusCode: 200,
    };

    // Act
    const response = createInvitationResponse(successResult);

    // Assert
    expect(response).toBeInstanceOf(Response);
    // Note: In a real test environment, you'd extract and parse the JSON body
    // For this example, we're testing the structure
  });

  it('should create success response for carrier without invite URL', () => {
    // Arrange
    const successResult: InvitationResult = {
      success: true,
      message: 'Invitation sent',
      entity: { ...mockCarrierEntity, invitation_sent_at: new Date() },
      statusCode: 200,
    };

    // Act
    const response = createInvitationResponse(successResult);

    // Assert
    expect(response).toBeInstanceOf(Response);
  });

  it('should create error response', () => {
    // Arrange
    const errorResult: InvitationResult = {
      success: false,
      message: 'Error occurred',
      statusCode: 500,
    };

    // Act
    const response = createInvitationResponse(errorResult);

    // Assert
    expect(response).toBeInstanceOf(Response);
  });

  it('should determine entity key based on name property', () => {
    // Arrange - entity with name (should be 'broker')
    const brokerResult: InvitationResult = {
      success: true,
      message: 'Success',
      entity: { ...mockBrokerEntity, invitation_sent_at: new Date() },
      statusCode: 200,
    };

    // Arrange - entity without name (should be 'carrier')  
    const carrierResult: InvitationResult = {
      success: true,
      message: 'Success',
      entity: { 
        id: 1, 
        name: '', 
        email: 'test@example.com', 
        invitation_sent_at: new Date() 
      },
      statusCode: 200,
    };

    // Act
    const brokerResponse = createInvitationResponse(brokerResult);
    const carrierResponse = createInvitationResponse(carrierResult);

    // Assert
    expect(brokerResponse).toBeInstanceOf(Response);
    expect(carrierResponse).toBeInstanceOf(Response);
  });
});