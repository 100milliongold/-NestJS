import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import * as config from 'config';

const jwtConfig = config.get('jwt');
@Injectable() //어디서나 주입이 가능하도록
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * 토큰체크
   * 웨에서 토큰이 유효한지 체크가 되면 validate 메소드에서 paload 에 있는 유저이름이 데이터베이스에서
   * 있는 유저인지 확인후 있다면 유저 겍체를 return 값으로 던져줍니다.
   * return 값은 @UserGuards(AuthGuard())를 이용한 모든 요청의 Request Object 에 들어갑니다.
   * @param payload
   */
  async validate(payload) {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
