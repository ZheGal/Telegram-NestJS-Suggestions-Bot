import { Module } from '@nestjs/common';
import { DialogService } from './dialog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from './dialog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dialog])],
  providers: [DialogService],
  exports: [DialogService],
})
export class DialogModule {}
