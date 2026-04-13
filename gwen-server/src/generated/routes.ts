/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatusController } from './../features/status/controllers/StatusController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GameController } from './../features/game/controllers/GameController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserFactionDeckController } from './../features/auth/controllers/UserFactionDeckController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../features/auth/controllers/AuthController';
import { expressAuthentication } from './../index';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (
  req: ExRequest,
  securityName: string,
  scopes?: string[],
  res?: ExResponse,
) => Promise<any>;

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  HealthStatus: {
    dataType: 'refObject',
    properties: {
      status: { dataType: 'string', required: true },
      timestamp: { dataType: 'string', required: true },
      uptime: { dataType: 'double', required: true },
      environment: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOGameStatus: {
    dataType: 'refAlias',
    type: {
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['ACTIVE'] },
        { dataType: 'enum', enums: ['FINISHED'] },
        { dataType: 'enum', enums: ['ABANDONED'] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOGame: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        updated_at: { dataType: 'string' },
        created_at: { dataType: 'string' },
        winner_id: {
          dataType: 'union',
          subSchemas: [{ dataType: 'string' }, { dataType: 'enum', enums: [null] }],
          required: true,
        },
        status: { ref: 'DTOGameStatus', required: true },
        player2_id: { dataType: 'string', required: true },
        player1_id: { dataType: 'string', required: true },
        _id: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOGamePhase: {
    dataType: 'refAlias',
    type: {
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['WAITING_FOR_PLAYERS'] },
        { dataType: 'enum', enums: ['REDRAW'] },
        { dataType: 'enum', enums: ['FLIP_COIN'] },
        { dataType: 'enum', enums: ['PLAY_CARDS'] },
        { dataType: 'enum', enums: ['END'] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Player: {
    dataType: 'refObject',
    properties: {},
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PlayerRows: {
    dataType: 'refObject',
    properties: {},
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOGameWithMetadata: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        game: {
          dataType: 'nestedObjectLiteral',
          nestedProperties: {
            player2Rows: { ref: 'PlayerRows', required: true },
            player1Rows: { ref: 'PlayerRows', required: true },
            player2: { ref: 'Player', required: true },
            player1: { ref: 'Player', required: true },
            phase: { ref: 'DTOGamePhase', required: true },
          },
          required: true,
        },
        metadata: { ref: 'DTOGame', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOFinishGameRequest: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: { winnerId: { dataType: 'string', required: true } },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOUserFactionDeck: {
    dataType: 'refObject',
    properties: {
      _id: { dataType: 'string' },
      user_id: { dataType: 'string', required: true },
      faction_id: { dataType: 'string', required: true },
      leader_card_id: {
        dataType: 'union',
        subSchemas: [{ dataType: 'string' }, { dataType: 'enum', enums: [null] }],
        required: true,
      },
      unit_card_ids: { dataType: 'array', array: { dataType: 'string' }, required: true },
      special_card_ids: { dataType: 'array', array: { dataType: 'string' }, required: true },
      created_at: { dataType: 'string' },
      updated_at: { dataType: 'string' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOUpdateUserFactionDeckRequest: {
    dataType: 'refObject',
    properties: {
      leaderCardId: {
        dataType: 'union',
        subSchemas: [{ dataType: 'string' }, { dataType: 'enum', enums: [null] }],
      },
      unitCardIds: { dataType: 'array', array: { dataType: 'string' } },
      specialCardIds: { dataType: 'array', array: { dataType: 'string' } },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOUser: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      username: { dataType: 'string', required: true },
      email: { dataType: 'string', required: true },
      bio: { dataType: 'string', required: true },
      profilePictureUrl: {
        dataType: 'union',
        subSchemas: [{ dataType: 'string' }, { dataType: 'enum', enums: [null] }],
      },
      elo: { dataType: 'double', required: true },
      favorite_deck: {
        dataType: 'union',
        subSchemas: [{ dataType: 'string' }, { dataType: 'enum', enums: [null] }],
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DTOLoginResponse: {
    dataType: 'refObject',
    properties: {
      token: { dataType: 'string', required: true },
      user: { ref: 'DTOUser', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LoginRequest: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        password: { dataType: 'string', required: true },
        username: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  RegisterRequest: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        password: { dataType: 'string', required: true },
        email: { dataType: 'string', required: true },
        username: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: 'silently-remove-extras',
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsStatusController_getHealth: Record<string, TsoaRoute.ParameterSchema> = {};
  app.get(
    '/api/status/health',
    ...fetchMiddlewares<RequestHandler>(StatusController),
    ...fetchMiddlewares<RequestHandler>(StatusController.prototype.getHealth),

    async function StatusController_getHealth(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsStatusController_getHealth,
          request,
          response,
        });

        const controller = new StatusController();

        await templateService.apiHandler({
          methodName: 'getHealth',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGameController_getGameWithMetadataById: Record<string, TsoaRoute.ParameterSchema> = {
    gameId: { in: 'path', name: 'gameId', required: true, dataType: 'string' },
  };
  app.get(
    '/api/games/:gameId/active',
    ...fetchMiddlewares<RequestHandler>(GameController),
    ...fetchMiddlewares<RequestHandler>(GameController.prototype.getGameWithMetadataById),

    async function GameController_getGameWithMetadataById(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGameController_getGameWithMetadataById,
          request,
          response,
        });

        const controller = new GameController();

        await templateService.apiHandler({
          methodName: 'getGameWithMetadataById',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGameController_getGame: Record<string, TsoaRoute.ParameterSchema> = {
    gameId: { in: 'path', name: 'gameId', required: true, dataType: 'string' },
  };
  app.get(
    '/api/games/:gameId',
    ...fetchMiddlewares<RequestHandler>(GameController),
    ...fetchMiddlewares<RequestHandler>(GameController.prototype.getGame),

    async function GameController_getGame(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGameController_getGame,
          request,
          response,
        });

        const controller = new GameController();

        await templateService.apiHandler({
          methodName: 'getGame',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGameController_finishGame: Record<string, TsoaRoute.ParameterSchema> = {
    gameId: { in: 'path', name: 'gameId', required: true, dataType: 'string' },
    body: { in: 'body', name: 'body', required: true, ref: 'DTOFinishGameRequest' },
  };
  app.post(
    '/api/games/:gameId/finish',
    ...fetchMiddlewares<RequestHandler>(GameController),
    ...fetchMiddlewares<RequestHandler>(GameController.prototype.finishGame),

    async function GameController_finishGame(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGameController_finishGame,
          request,
          response,
        });

        const controller = new GameController();

        await templateService.apiHandler({
          methodName: 'finishGame',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGameController_abandonGame: Record<string, TsoaRoute.ParameterSchema> = {
    gameId: { in: 'path', name: 'gameId', required: true, dataType: 'string' },
  };
  app.post(
    '/api/games/:gameId/abandon',
    ...fetchMiddlewares<RequestHandler>(GameController),
    ...fetchMiddlewares<RequestHandler>(GameController.prototype.abandonGame),

    async function GameController_abandonGame(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGameController_abandonGame,
          request,
          response,
        });

        const controller = new GameController();

        await templateService.apiHandler({
          methodName: 'abandonGame',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserFactionDeckController_getUserFactionDecks: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: 'path', name: 'userId', required: true, dataType: 'string' },
  };
  app.get(
    '/api/user/:userId/decks',
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController),
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController.prototype.getUserFactionDecks),

    async function UserFactionDeckController_getUserFactionDecks(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserFactionDeckController_getUserFactionDecks,
          request,
          response,
        });

        const controller = new UserFactionDeckController();

        await templateService.apiHandler({
          methodName: 'getUserFactionDecks',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserFactionDeckController_getOrCreateUserFactionDeck: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: 'path', name: 'userId', required: true, dataType: 'string' },
    factionId: { in: 'path', name: 'factionId', required: true, dataType: 'string' },
  };
  app.get(
    '/api/user/:userId/decks/:factionId',
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController),
    ...fetchMiddlewares<RequestHandler>(
      UserFactionDeckController.prototype.getOrCreateUserFactionDeck,
    ),

    async function UserFactionDeckController_getOrCreateUserFactionDeck(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserFactionDeckController_getOrCreateUserFactionDeck,
          request,
          response,
        });

        const controller = new UserFactionDeckController();

        await templateService.apiHandler({
          methodName: 'getOrCreateUserFactionDeck',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserFactionDeckController_updateUserFactionDeck: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: 'path', name: 'userId', required: true, dataType: 'string' },
    factionId: { in: 'path', name: 'factionId', required: true, dataType: 'string' },
    body: { in: 'body', name: 'body', required: true, ref: 'DTOUpdateUserFactionDeckRequest' },
  };
  app.put(
    '/api/user/:userId/decks/:factionId',
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController),
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController.prototype.updateUserFactionDeck),

    async function UserFactionDeckController_updateUserFactionDeck(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserFactionDeckController_updateUserFactionDeck,
          request,
          response,
        });

        const controller = new UserFactionDeckController();

        await templateService.apiHandler({
          methodName: 'updateUserFactionDeck',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserFactionDeckController_deleteUserFactionDeck: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: 'path', name: 'userId', required: true, dataType: 'string' },
    factionId: { in: 'path', name: 'factionId', required: true, dataType: 'string' },
  };
  app.delete(
    '/api/user/:userId/decks/:factionId',
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController),
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController.prototype.deleteUserFactionDeck),

    async function UserFactionDeckController_deleteUserFactionDeck(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserFactionDeckController_deleteUserFactionDeck,
          request,
          response,
        });

        const controller = new UserFactionDeckController();

        await templateService.apiHandler({
          methodName: 'deleteUserFactionDeck',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 204,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserFactionDeckController_setFavoriteDeck: Record<string, TsoaRoute.ParameterSchema> = {
    userId: { in: 'path', name: 'userId', required: true, dataType: 'string' },
    body: {
      in: 'body',
      name: 'body',
      required: true,
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        factionId: {
          dataType: 'union',
          subSchemas: [{ dataType: 'string' }, { dataType: 'enum', enums: [null] }],
          required: true,
        },
      },
    },
  };
  app.patch(
    '/api/user/:userId/favorite',
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController),
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController.prototype.setFavoriteDeck),

    async function UserFactionDeckController_setFavoriteDeck(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserFactionDeckController_setFavoriteDeck,
          request,
          response,
        });

        const controller = new UserFactionDeckController();

        await templateService.apiHandler({
          methodName: 'setFavoriteDeck',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserFactionDeckController_getFavoriteDeck: Record<string, TsoaRoute.ParameterSchema> = {
    userId: { in: 'path', name: 'userId', required: true, dataType: 'string' },
  };
  app.get(
    '/api/user/:userId/favorite',
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController),
    ...fetchMiddlewares<RequestHandler>(UserFactionDeckController.prototype.getFavoriteDeck),

    async function UserFactionDeckController_getFavoriteDeck(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserFactionDeckController_getFavoriteDeck,
          request,
          response,
        });

        const controller = new UserFactionDeckController();

        await templateService.apiHandler({
          methodName: 'getFavoriteDeck',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
    body: { in: 'body', name: 'body', required: true, ref: 'LoginRequest' },
  };
  app.post(
    '/api/auth/login',
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.login),

    async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_login,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'login',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
    body: { in: 'body', name: 'body', required: true, ref: 'RegisterRequest' },
  };
  app.post(
    '/api/auth/register',
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.register),

    async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_register,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'register',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_getCurrentUser: Record<string, TsoaRoute.ParameterSchema> = {
    request: { in: 'request', name: 'request', required: true, dataType: 'object' },
  };
  app.get(
    '/api/auth/me',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.getCurrentUser),

    async function AuthController_getCurrentUser(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_getCurrentUser,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'getCurrentUser',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_getUser: Record<string, TsoaRoute.ParameterSchema> = {
    userId: { in: 'path', name: 'userId', required: true, dataType: 'string' },
  };
  app.get(
    '/api/auth/users/:userId',
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.getUser),

    async function AuthController_getUser(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_getUser,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'getUser',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return async function runAuthenticationMiddleware(request: any, response: any, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      // keep track of failed auth attempts so we can hand back the most
      // recent one.  This behavior was previously existing so preserving it
      // here
      const failedAttempts: any[] = [];
      const pushAndRethrow = (error: any) => {
        failedAttempts.push(error);
        throw error;
      };

      const secMethodOrPromises: Promise<any>[] = [];
      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          const secMethodAndPromises: Promise<any>[] = [];

          for (const name in secMethod) {
            secMethodAndPromises.push(
              expressAuthenticationRecasted(request, name, secMethod[name], response).catch(
                pushAndRethrow,
              ),
            );
          }

          // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

          secMethodOrPromises.push(
            Promise.all(secMethodAndPromises).then((users) => {
              return users[0];
            }),
          );
        } else {
          for (const name in secMethod) {
            secMethodOrPromises.push(
              expressAuthenticationRecasted(request, name, secMethod[name], response).catch(
                pushAndRethrow,
              ),
            );
          }
        }
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      try {
        request['user'] = await Promise.any(secMethodOrPromises);

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }

        next();
      } catch (err) {
        // Show most recent error as response
        const error = failedAttempts.pop();
        error.status = error.status || 401;

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }
        next(error);
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
