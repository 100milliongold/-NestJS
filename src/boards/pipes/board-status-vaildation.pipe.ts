import { BadRequestException, PipeTransform } from '@nestjs/common';

import { BoardStatus } from '../board-status.enum';

export class BoardStatusVaildationPipe implements PipeTransform {
  readonly StatusOption = [BoardStatus.PUBLIC, BoardStatus.PRIVATE];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusVaild(value)) {
      throw new BadRequestException(`${value} isn't in the status options`);
    }

    return value;
  }

  private isStatusVaild(status: any) {
    const index = this.StatusOption.indexOf(status);
    return index !== -1;
  }
}
