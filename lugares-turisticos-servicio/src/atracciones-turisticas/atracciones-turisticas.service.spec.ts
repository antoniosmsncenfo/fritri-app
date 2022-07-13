import { Test, TestingModule } from '@nestjs/testing';
import { AtraccionesTuristicasService } from './atracciones-turisticas.service';

describe('AtraccionesTuristicasService', () => {
  let service: AtraccionesTuristicasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtraccionesTuristicasService],
    }).compile();

    service = module.get<AtraccionesTuristicasService>(
      AtraccionesTuristicasService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
