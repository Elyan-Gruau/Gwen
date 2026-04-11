import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from '../services/AuthService.js';
import { UserService } from '../services/UserService.js';
import { PasswordHasher } from '../services/PasswordHasher.js';
import { JwtService } from '../services/JwtService.js';
import { UserRepository } from '../repository/UserRepository.js';
import { InvalidCredentialException } from '../exceptions/InvalidCredentialException.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import { IllegalUsernameException } from '../exceptions/IllegalUsernameException.js';
import { IllegalEmailException } from '../exceptions/IllegalEmailException.js';
import { DuplicateUsernameException } from '../exceptions/DuplicateUsernameException.js';
import { DuplicateEmailException } from '../exceptions/DuplicateEmailException.js';
import type { DTOLoginResponse, DTOUser } from '../dtos/DTOLoginResponse.js';

type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const jwtExpiration = parseInt(process.env.JWT_EXPIRATION || '3600000', 10);
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const passwordHasher = new PasswordHasher();
const jwtService = new JwtService(jwtSecret, jwtExpiration);
const authService = new AuthService(userService, passwordHasher, jwtService, jwtExpiration);

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  @Post('login')
  @SuccessResponse('200', 'Login successful')
  @Response('401', 'Invalid credentials')
  public async login(@Body() body: LoginRequest): Promise<DTOLoginResponse> {
    try {
      return await authService.login(body.username, body.password);
    } catch (error) {
      if (error instanceof InvalidCredentialException || error instanceof UserNotFoundException) {
        return this.throwHttpError('Invalid credentials', 401);
      }

      return this.throwHttpError('Unexpected error while logging in', 500);
    }
  }

  @Post('register')
  @SuccessResponse('200', 'Registration successful')
  @Response('400', 'Invalid registration payload')
  @Response('409', 'Username or email already exists')
  public async register(@Body() body: RegisterRequest): Promise<DTOLoginResponse> {
    try {
      return await authService.register(body.username, body.email, body.password);
    } catch (error) {
      if (error instanceof IllegalUsernameException || error instanceof IllegalEmailException) {
        return this.throwHttpError(error.message, 400);
      }

      if (error instanceof DuplicateUsernameException || error instanceof DuplicateEmailException) {
        return this.throwHttpError(error.message, 409);
      }

      return this.throwHttpError('Unexpected error while registering user', 500);
    }
  }

  @Get('me')
  @Security('jwt')
  @SuccessResponse('200', 'Current user fetched')
  @Response('401', 'Unauthorized')
  public async getCurrentUser(@Request() request: ExpressRequest): Promise<DTOUser> {
    try {
      const authHeader = request.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return this.throwHttpError('Missing or invalid Authorization header', 401);
      }

      const token = authHeader.substring('Bearer '.length);
      const userId = jwtService.extractUserId(token);

      if (!userId) {
        return this.throwHttpError('Invalid token payload', 401);
      }

      const user = await userService.getUserById(userId);

      return {
        _id: user._id?.toString() || '',
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        profilePictureUrl: user.profilePictureUrl,
        elo: user.elo || 1200,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return this.throwHttpError('User not found', 404);
      }

      return this.throwHttpError('Unexpected error while fetching current user', 500);
    }
  }

  @Get('users/{userId}')
  @SuccessResponse('200', 'User found')
  @Response('404', 'User not found')
  public async getUser(@Path() userId: string): Promise<DTOUser> {
    try {
      const user = await userService.getUserById(userId);

      return {
        _id: user._id?.toString() || '',
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        profilePictureUrl: user.profilePictureUrl,
        elo: user.elo || 1200,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return this.throwHttpError('User not found', 404);
      }

      return this.throwHttpError('Unexpected error while fetching user', 500);
    }
  }

  private throwHttpError(message: string, status: number): never {
    this.setStatus(status);
    const httpError = new Error(message) as Error & { status?: number };
    httpError.status = status;
    throw httpError;
  }
}
