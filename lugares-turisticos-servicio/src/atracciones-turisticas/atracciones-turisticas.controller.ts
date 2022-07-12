import { Controller, Get } from '@nestjs/common';
import { AtraccionesTuristicasService } from './atracciones-turisticas.service';

@Controller('atracciones-turisticas')
export class AtraccionesTuristicasController {
  constructor(
    private readonly atraccionesTuristicasService: AtraccionesTuristicasService,
  ) {}
}
