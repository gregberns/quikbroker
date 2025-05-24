import { 
  createEntity,
  validateEntityCreationRequest,
  createEntityResponse,
  type EntityCreationConfig,
  type EntityCreationResult
} from '../entityCreation';
import { withTransaction } from '@/db/transaction';
import { hashPassword } from '@/app/lib/auth';
import { createUser } from '@/db/queries/users';
import { createUserInvite } from '@/db/queries/userInvites';
import { createJob } from '@/db/queries/jobs';

// Mock external dependencies
jest.mock('@/db/transaction');
jest.mock('@/app/lib/auth');
jest.mock('@/db/queries/users');
jest.mock('@/db/queries/userInvites');
jest.mock('@/db/queries/jobs');
jest.mock('@/app/lib/worker', () => ({
  processJob: jest.fn(),
}));

const mockWithTransaction = withTransaction as jest.MockedFunction<typeof withTransaction>;
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockCreateUserInvite = createUserInvite as jest.MockedFunction<typeof createUserInvite>;
const mockCreateJob = createJob as jest.MockedFunction<typeof createJob>;

describe('validateEntityCreationRequest', () => {
  it('should return valid result for proper broker input', () => {
    const input = { name: 'Test Broker', email: 'test@example.com', contactName: 'John Doe' };
    const result = validateEntityCreationRequest(input);
    
    expect(result.isValid).toBe(true);
    expect(result.input).toEqual(input);
    expect(result.error).toBeUndefined();
  });

  it('should return valid result for proper carrier input', () => {
    const input = { carrier_name: 'Test Carrier', email: 'test@example.com', address: '123 Main St' };
    const result = validateEntityCreationRequest(input);
    
    expect(result.isValid).toBe(true);
    expect(result.input).toEqual(input);
    expect(result.error).toBeUndefined();
  });

  it('should return invalid result for null input', () => {
    const result = validateEntityCreationRequest(null);
    
    expect(result.isValid).toBe(false);
    expect(result.input).toBeUndefined();
    expect(result.error).toEqual({
      message: 'Invalid request body',
      statusCode: 400
    });
  });

  it('should return invalid result for non-object input', () => {
    const result = validateEntityCreationRequest('invalid');
    
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toBe('Invalid request body');
  });
});

describe('createEntity', () => {
  const mockEntityFn = jest.fn();
  const mockSession = { id: 'user123', role: 'admin' };
  const mockRequest = { url: '/api/test' } as { url: string };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWithTransaction.mockImplementation((fn) => fn());
  });

  describe('validation', () => {
    it('should validate required fields', async () => {
      const config: EntityCreationConfig = {
        entityType: 'broker',
        createUser: false,
        taskIdentifier: 'test',
        requiredFields: ['name', 'email'],
      };

      const input = { email: 'test@example.com' }; // missing name for broker

      const result = await createEntity(input, config, mockEntityFn, mockSession, mockRequest);

      expect(result.success).toBe(false);
      expect(result.message).toBe('name is required');
      expect(result.statusCode).toBe(400);
      expect(result.errorType).toBe('validation');
    });

    it('should run custom validation', async () => {
      const config: EntityCreationConfig = {
        entityType: 'broker',
        createUser: false,
        taskIdentifier: 'test',
        requiredFields: ['name'],
        entitySpecificValidation: () => 'Custom validation failed',
      };

      const input = { name: 'Test' };

      const result = await createEntity(input, config, mockEntityFn, mockSession, mockRequest);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Custom validation failed');
      expect(result.errorType).toBe('validation');
    });
  });

  describe('without user creation', () => {
    it('should create entity successfully', async () => {
      const config: EntityCreationConfig = {
        entityType: 'carrier',
        createUser: false,
        taskIdentifier: 'test',
        requiredFields: ['carrier_name', 'address'],
      };

      const input = { carrier_name: 'Test Carrier', address: '123 Main St' };
      const mockEntity = { id: 1, ...input };
      mockEntityFn.mockResolvedValue(mockEntity);

      const result = await createEntity(input, config, mockEntityFn, mockSession, mockRequest);

      expect(result.success).toBe(true);
      expect(result.entity).toEqual(mockEntity);
      expect(result.statusCode).toBe(201);
      expect(result.user).toBeUndefined();
      expect(result.inviteUrl).toBeUndefined();
      expect(mockWithTransaction).not.toHaveBeenCalled();
    });
  });

  describe('with user creation', () => {
    it('should create entity with user successfully', async () => {
      const config: EntityCreationConfig = {
        entityType: 'broker',
        createUser: true,
        taskIdentifier: 'broker_email_invite',
        requiredFields: ['name', 'email'],
      };

      const input = { name: 'Test Broker', email: 'broker@example.com', contactName: 'John Doe' };
      const mockUser = { id: 1, email: 'broker@example.com', role: 'broker' };
      const mockEntity = { id: 1, ...input, owner_user_id: 1 };
      const mockInvite = { id: 1, token: 'test-token' };
      const mockJobResult = { id: 1 };

      mockHashPassword.mockResolvedValue('hashed-password');
      mockCreateUser.mockResolvedValue(mockUser);
      mockEntityFn.mockResolvedValue(mockEntity);
      mockCreateUserInvite.mockResolvedValue(mockInvite);
      mockCreateJob.mockResolvedValue(mockJobResult);

      const result = await createEntity(input, config, mockEntityFn, mockSession, mockRequest);

      expect(result.success).toBe(true);
      expect(result.entity).toEqual(mockEntity);
      expect(result.user).toEqual(mockUser);
      expect(result.inviteUrl).toMatch(/\/verify-email\?token=\w+/);
      expect(result.statusCode).toBe(201);

      expect(mockWithTransaction).toHaveBeenCalled();
      expect(mockCreateUser).toHaveBeenCalledWith({
        email: 'broker@example.com',
        password_hash: 'hashed-password',
        role: 'broker',
      });
      expect(mockEntityFn).toHaveBeenCalledWith(input, 1);
    });

    it('should handle duplicate email error', async () => {
      const config: EntityCreationConfig = {
        entityType: 'broker',
        createUser: true,
        taskIdentifier: 'test',
        requiredFields: ['name', 'email'],
      };

      const input = { name: 'Test', email: 'test@example.com' };
      const error = new Error('Duplicate') as Error & { code: string; constraint: string };
      error.code = '23505';
      error.constraint = 'users_email_key';
      
      mockWithTransaction.mockRejectedValue(error);

      const result = await createEntity(input, config, mockEntityFn, mockSession, mockRequest);

      expect(result.success).toBe(false);
      expect(result.message).toBe('A user with this email already exists');
      expect(result.statusCode).toBe(409);
      expect(result.errorType).toBe('duplicate');
    });
  });
});

describe('createEntityResponse', () => {
  it('should create success response with entity only', () => {
    const result: EntityCreationResult = {
      success: true,
      entity: { id: 1, name: 'Test' },
      statusCode: 201,
    };

    const response = createEntityResponse(result, 'carrier');
    expect(response).toBeInstanceOf(Response);
  });

  it('should create success response with user and invite URL', () => {
    const result: EntityCreationResult = {
      success: true,
      entity: { id: 1, name: 'Test' },
      user: { id: 1, email: 'test@example.com', role: 'broker' },
      inviteUrl: 'https://example.com/invite',
      statusCode: 201,
    };

    const response = createEntityResponse(result, 'broker');
    expect(response).toBeInstanceOf(Response);
  });

  it('should create error response', () => {
    const result: EntityCreationResult = {
      success: false,
      message: 'Validation failed',
      statusCode: 400,
      errorType: 'validation',
    };

    const response = createEntityResponse(result, 'broker');
    expect(response).toBeInstanceOf(Response);
  });
});