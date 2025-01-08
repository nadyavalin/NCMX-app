type DateString = `${number}-${number}-${number}`;

export interface ItemResponseGET {
  id: number;
  num_nonconf: number;
  norm_doc: string;
  nonconf: string;
  report: string;
  analysis_start_date: DateString;
  head_auditor: string;
  reason: string;
  correction: string;
  correction_date: DateString;
  resp_person_correction: string;
  corrective_action: string;
  corrective_action_date: DateString;
  resp_person_corrective_action: string;
}

export interface ItemRequestPOST {
  num_nonconf: number;
  norm_doc: string;
  nonconf: string;
  report: string;
  analysis_start_date: DateString;
  head_auditor: string;
  reason: string;
  correction: string;
  correction_date: DateString;
  resp_person_correction: string;
  corrective_action: string;
  corrective_action_date: DateString;
  resp_person_corrective_action: string;
}
