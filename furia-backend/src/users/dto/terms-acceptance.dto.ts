import { IsBoolean } from 'class-validator';

export class TermsAcceptanceDto {
  @IsBoolean()
  accepted: boolean;
} 