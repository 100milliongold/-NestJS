import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  /**
   * 게시판 리스트
   * @returns 리스트
   */
  async getAllByusersBoards(user: User): Promise<Board[]> {
    // return this.boardRepository.find();
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  /**
   * 게시판 생성
   * @param createBoardDto 입력되는 데이터
   * @returns 게시판 내용
   */
  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  /**
   * 게시판 조회
   * @param id 기본키
   * @returns 게시판 내용
   */
  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return found;
  }

  /**
   * 게시판 삭제
   * @param id 게시판 기본키
   */
  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  /**
   * 게시판 상태 변경
   * @param id 기본키
   * @param status 게시판 상태
   * @returns 게시판 내용
   */
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }
}
