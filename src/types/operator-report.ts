export interface OperatorGroupedReportItem {
  gametype: string;
  roundrecordgametype: string | null;
  operatorid: number;
  operatorname: string;
  totalplaced: string;
  totalwinning: string;
  netholding: number;
  parentShares: any[];
}

export type OperatorGroupedReport = OperatorGroupedReportItem[];

export interface OperatorGroupedReportFilter {
  startDate?: string | Date;
  endDate?: string | Date;
}
