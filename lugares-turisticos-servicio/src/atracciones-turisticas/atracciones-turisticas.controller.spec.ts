import { Test, TestingModule } from '@nestjs/testing';
import { AtraccionesTuristicasController } from './atracciones-turisticas.controller';
import { AtraccionesTuristicasService } from './atracciones-turisticas.service';

describe('AtraccionesTuristicasController', () => {
  let controller: AtraccionesTuristicasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtraccionesTuristicasController],
      providers: [AtraccionesTuristicasService],
    }).compile();

    controller = module.get<AtraccionesTuristicasController>(AtraccionesTuristicasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
