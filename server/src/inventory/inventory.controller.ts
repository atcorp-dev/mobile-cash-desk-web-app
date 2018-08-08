import { ApiUseTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiUseTags('Inventory')
@Controller('Inventory')
export class InventoryController {}

