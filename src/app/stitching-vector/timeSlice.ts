export class TimeSlice {
  sliceNumber: number;
  errorMessage: string;
  _links: any;
}

export interface PaginatedTimeSlices {
  page: any;
  data: TimeSlice[];
  _links: any;
}
