export interface InconsistencyNumberState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
}

export interface RootState {
  num: InconsistencyNumberState;
}

type DateString = `${number}-${number}-${number}`;

export interface ItemResponseGET {
  num_nonconf: number;
  department?: string;
  norm_doc?: string;
  nonconf?: string;
  report?: string;
  report_date?: DateString;
  analysis_start_date?: DateString;
  analysis_finish_date?: DateString;
  head_auditor?: string;
  auditor?: string;
  reason?: string;
  correction?: string;
  correction_date?: DateString;
  resp_person_correction?: string;
  corrective_action?: string;
  corrective_action_date?: DateString;
  resp_person_corrective_action?: string;
  estimate?: number;
  nonconf_closure_date?: DateString;
  resp_person_nonconf_closure?: string;
  auto_data?: string;
}

export interface APIResponse {
  results: ItemResponseGET[];
}

export interface ItemCommentResponseGET {
  id: number;
  num_nonconf: number;
  comment_author: string;
  comment_text: string;
  auto_data: DateString;
}

export interface APICommentsResponse {
  results: ItemCommentResponseGET[];
}

export interface ItemRequestPOST {
  num_nonconf: number;
  department?: string;
  norm_doc?: string;
  nonconf?: string;
  report?: string;
  report_date?: string;
  analysis_start_date?: string;
  analysis_finish_date?: string;
  head_auditor?: string;
  auditor?: string;
  reason?: string;
  correction?: string;
  correction_date?: string;
  resp_person_correction?: string;
  corrective_action?: string;
  corrective_action_date?: string;
  resp_person_corrective_action?: string;
  estimate?: number;
  nonconf_closure_date?: string;
  resp_person_nonconf_closure?: string;
  auto_data?: string;
}

export interface ItemCommentRequestPOST {
  num_nonconf: number | null;
  comment_author: string;
  comment_text: string;
}
