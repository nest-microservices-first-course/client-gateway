import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { RegisterUserDto } from "./dto/register-user.dto";
import { NATS_SERVICE } from "src/config";
import { LoginUserDto } from "./dto/login-user.dto";
import { firstValueFrom } from "rxjs";
import { Request } from "express";
import { AuthGuard } from "./guards/auth.guard";
import { User } from "./decorators/user.decorator";
import { CurrentUser } from "./interfaces/current-user.interface";
import { Token } from "./decorators/token.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user = await firstValueFrom(
        this.client.send('auth.register.user', registerUserDto)
      );

      return user;

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await firstValueFrom(
        this.client.send('auth.login.user', loginUserDto)
      );
      return user;

    } catch (error) {
      throw new RpcException(error);
    }

  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {

    // return this.client.send('auth.verify.token', {});
    return { user, token };
  }
}
