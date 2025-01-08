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
  comment_date: DateString;
  comment_author: string;
  comment_text: string;
}

export interface ItemRequestPOST {
  num_nonconf: number;
  norm_doc: string;
  nonconf: string;
  report: string;
  analysis_start_date: string;
  head_auditor: string;
  reason: string;
  correction: string;
  correction_date: string;
  resp_person_correction: string;
  corrective_action: string;
  corrective_action_date: string;
  resp_person_corrective_action: string;
}

export interface ItemCommentRequestPOST {
  id: number;
  comment_date: string;
  comment_author: string;
  comment_text: string;
}
