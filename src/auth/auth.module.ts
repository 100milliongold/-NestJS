import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // 유저를 인증하기 위해 사용할 기본 strategy 를 명시해주기,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // jwt 인증 부분을 담당, 그리고 주로 sign()를 위한 부분이다.
    JwtModule.register({
      secret: 'Secret1234',
      signOptions: {
        expiresIn: 60 * 60,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  // Jwtstrategy 를 dl Auth 모듈에서 사용할수 있게 등록
  providers: [AuthService, JwtStrategy],
  // JwtStrategy, PassportModule 를 다른 모듈에서 사용할수 있게 등록
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
