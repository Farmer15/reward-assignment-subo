import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { AxiosError } from "axios";

export function handleAxiosError(error: unknown, fallbackMessage: string): never {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    const message = error.response.data?.message;
    const errorMessage = typeof message === "string" ? message : fallbackMessage;

    switch (status) {
      case 400:
        throw new BadRequestException(errorMessage);
      case 401:
        throw new UnauthorizedException(errorMessage);
      case 403:
        throw new ForbiddenException(errorMessage);
      case 404:
        throw new NotFoundException(errorMessage);
      case 409:
        throw new ConflictException(errorMessage);
      default:
        throw new InternalServerErrorException(errorMessage);
    }
  }

  throw new InternalServerErrorException(fallbackMessage);
}
