export class TimeSlice {
  sliceNumber: number;
  _links: any;
}

export interface PaginatedTimeSlices {
  page: any;
  data: TimeSlice[];
  _links: any;
}
