import { IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateTaskInput {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDateString()
  scheduleAt?: string;
}