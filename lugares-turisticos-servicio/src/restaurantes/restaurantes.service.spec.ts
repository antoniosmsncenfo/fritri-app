import { Test, TestingModule } from '@nestjs/testing';
import { LugaresGoogleService } from '../lugares-google/lugares-google.service';

describe('RestaurantesService', () => {
  let service: LugaresGoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LugaresGoogleService],
    }).compile();

    service = module.get<LugaresGoogleService>(LugaresGoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
