import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { v1 as uuid } from 'uuid';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  getAllBoards(): Board[] {
    return this.boards;
  }

  createBoard(title: string, description: string): Board {
    const board: Board = {
      title,
      description,
      status: BoardStatus.PUBLIC,
      id: uuid(),
    };

    this.boards.push(board);

    return board;
  }
}
