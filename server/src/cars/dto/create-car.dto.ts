export class CreateCarDto {
  make!: string;
  model!: string;
  year!: string;
  price!: string;
  mileage!: string;
  location!: string;
  description?: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
}