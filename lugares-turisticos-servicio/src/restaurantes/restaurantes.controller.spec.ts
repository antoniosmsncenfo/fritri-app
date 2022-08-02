import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesController } from './restaurantes.controller';
import { LugaresGoogleService } from '../lugares-google/lugares-google.service';

describe('RestaurantesController', () => {
  let controller: RestaurantesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantesController],
      providers: [LugaresGoogleService],
    }).compile();

    controller = module.get<RestaurantesController>(RestaurantesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
