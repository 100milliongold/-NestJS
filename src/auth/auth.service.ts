import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  /**
   * 회원가입
   * @param authCredendialsDto 유저입력 값
   * @returns 유저정보
   */
  async signUp(authCredendialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredendialsDto);
  }
}
