import { Test, TestingModule } from '@nestjs/testing';
import { RestartWarningService } from './restart-warning.service';

describe('RestartWarningService', () => {
  let service: RestartWarningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestartWarningService],
    }).compile();

    service = module.get<RestartWarningService>(RestartWarningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
