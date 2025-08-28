export type DateString = string;

export interface NormativeDocument {
  norm_doc?: string;
  point?: string;
}

export interface IAuditors {
  auditor?: string;
}

export interface Responsible {
  department?: string;
  person?: string;
}

export interface ItemRequestPOST {
  num_nonconf: number;
  normative_documents?: NormativeDocument[];
  head_auditor?: string;
  auditors?: IAuditors[];
  nonconf?: string;
  report?: string;
  report_date?: string | null;
  analysis_start_date?: string | null;
  analysis_finish_date?: string | null;
  reason?: string;
  correction?: string;
  correction_date?: string | null;
  responsible_for_correction?: Responsible[];
  corrective_action?: string;
  corrective_action_date?: string | null;
  responsible_for_corrective_action?: Responsible[];
  estimate?: number | null;
  nonconf_closure_date?: string | null;
  resp_person_nonconf_closure?: string;
  is_archived?: boolean;
}

export interface ItemResponseGET extends ItemRequestPOST {
  auto_data?: DateString;
}

export interface InconsistencyNumberState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  isModalEditOpen: boolean;
  items: ItemResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
  createLoading: boolean;
  createError: string | null;
  commentLoading: boolean;
  commentError: string | null;
  comments: ItemCommentResponseGET[];
}

export interface APIResponse {
  results: ItemResponseGET[];
}

export interface ItemCommentResponseGET {
  id: number;
  num_nonconf: number;
  comment_author: string;
  comment_text: string;
  created_at: DateString;
}

export interface APICommentsResponse {
  results: ItemCommentResponseGET[];
}

export interface ItemCommentRequestPOST {
  num_nonconf: number | null;
  comment_author: string;
  comment_text: string;
}

export interface ItemCommentRequestPATCH {
  num_nonconf: number | null;
  comment_text: string;
}

export enum SnackbarType {
  error = "error",
  success = "success",
}
