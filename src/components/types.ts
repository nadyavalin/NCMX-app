export type DateString = string;

export interface InconsistencyNumberState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  items: ItemResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
}

export interface ItemResponseGET {
  num_nonconf: number;
  department?: string;
  norm_doc?: string;
  point?: string;
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
  department_correction?: string;
  corrective_action?: string;
  corrective_action_date?: DateString;
  resp_person_corrective_action?: string;
  department_corrective_action?: string;
  estimate?: number;
  nonconf_closure_date?: DateString;
  resp_person_nonconf_closure?: string;
  auto_data?: string;
}

export interface APIResponse {
  results: ItemResponseGET[];
}

export interface ItemCommentResponseGET {
  id: string;
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
  point?: string;
  nonconf?: string;
  report?: string;
  report_date?: string | null;
  analysis_start_date?: string | null;
  analysis_finish_date?: string | null;
  head_auditor?: string;
  auditor?: string;
  reason?: string;
  correction?: string;
  correction_date?: string | null;
  resp_person_correction?: string;
  department_correction?: string;
  corrective_action?: string;
  corrective_action_date?: string | null;
  resp_person_corrective_action?: string;
  department_corrective_action?: string;
  estimate?: number | null;
  nonconf_closure_date?: string | null;
  resp_person_nonconf_closure?: string;
  auto_data?: string;
}

export interface ItemCommentRequestPOST {
  num_nonconf: number | null;
  comment_author: string;
  comment_text: string;
}

export enum SnackbarType {
  error = "error",
  success = "success",
}
