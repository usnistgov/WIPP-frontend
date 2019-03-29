export class TimeSlice {
  sliceNumber: number;
  errorMessage: string;
  _links: any;
}

export interface PaginatedTimeSlices {
  page: any;
  timeSlices: TimeSlice[];
  _links: any;
}
