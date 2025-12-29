export type DateString = string;

export interface NormativeDocument {
  norm_doc: string;
  point: string;
}

export interface IAuditors {
  auditor: string;
}

export interface Responsible {
  department: string;
  person: string;
}

export interface Correction {
  correction: string | undefined;
  correction_date: string | null | undefined;
  responsible_for_correction: Responsible[];
}

export interface CorrectiveAction {
  corrective_action: string | undefined;
  corrective_action_date: string | null | undefined;
  responsible_for_corrective_action: Responsible[];
}

export interface InconsistencyRequestPOST {
  num_nonconf: number | undefined;
  normative_documents: NormativeDocument[] | undefined;
  nonconf: string;
  report: string;
  report_date: string | null | undefined;
  analysis_start_date: string | null | undefined;
  analysis_finish_date: string | null | undefined;
  head_auditor: string;
  auditors: IAuditors[] | undefined;
  reason: string;
  corrections: Correction[] | undefined;
  corrective_actions: CorrectiveAction[] | undefined;
  estimate: number | null;
  nonconf_closure_date: string | null | undefined;
  resp_person_nonconf_closure: string;
  is_archived?: boolean;
}

export interface InconsistencyResponseGET {
  num_nonconf: number;
  normative_documents: NormativeDocument[];
  nonconf: string;
  report: string;
  report_date: string | null | undefined;
  analysis_start_date: string | null | undefined;
  analysis_finish_date: string | null | undefined;
  head_auditor: string;
  auditors: IAuditors[];
  reason: string;
  corrections: Correction[];
  corrective_actions: CorrectiveAction[];
  estimate: number | null;
  nonconf_closure_date: string | null;
  resp_person_nonconf_closure: string;
  is_archived: boolean;
}

export interface InconsistencyNumberState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  isModalEditOpen: boolean;
  items: InconsistencyResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
  createLoading: boolean;
  createError: string | null;
  commentLoading: boolean;
  commentError: string | null;
  comments: ItemCommentResponseGET[];
}

export interface Solution {
  solution: string | undefined;
  solution_date: string | null | undefined;
  responsible_for_solution: Responsible[];
}

export interface ObservationRequestPOST {
  num_observation: number | undefined;
  normative_documents: NormativeDocument[] | undefined;
  observation: string;
  report: string;
  report_date: string | null | undefined;
  analysis_start_date: string | null | undefined;
  analysis_finish_date: string | null | undefined;
  solutions: Solution[] | undefined;
  observation_closure_date: string | null | undefined;
  resp_person_observation_closure: string;
  is_archived?: boolean;
}

export interface ObservationResponseGET {
  num_observation: number;
  normative_documents: NormativeDocument[];
  observation: string;
  report: string;
  report_date: string | null | undefined;
  analysis_start_date: string | null | undefined;
  analysis_finish_date: string | null | undefined;
  solutions: Solution[];
  observation_closure_date: string | null;
  resp_person_observation_closure: string;
  is_archived: boolean;
}

export interface APIResponse {
  results: InconsistencyResponseGET[];
}

export interface ImprovementRequestPOST {
  num_improvement: number;
  improvement: string;
  report: string;
  report_date: string | null;
  resp_persons_for_improvement_implementation: Responsible[];
  date_implementation_for_improvement: string | null;
  improvement_closure_date: string | null;
  resp_person_improvement_closure: string;
  is_archived?: boolean;
}

export interface ImprovementResponseGET {
  num_improvement: number;
  improvement: string;
  report: string;
  report_date: string | null;
  resp_persons_for_improvement_implementation: Responsible[];
  date_implementation_for_improvement: string | null;
  improvement_closure_date: string | null;
  resp_person_improvement_closure: string;
  auto_data: string;
  is_archived: boolean;
}

export type CommentContentType = "inconsistency" | "observation" | "improvement";

export interface ItemCommentResponseGET {
  id: number;
  content_type: CommentContentType;
  object_id: number;
  comment_author: string;
  comment_text: string;
  created_at: DateString;
  // Поля для обратной совместимости
  num_nonconf?: number;
  num_observation?: number;
}

export interface APICommentsResponse {
  results: ItemCommentResponseGET[];
}

export interface ItemCommentRequestPOST {
  content_type: CommentContentType;
  object_id: number;
  comment_author: string;
  comment_text: string;
}

export interface ItemCommentRequestPATCH {
  comment_text: string;
}

export type RescheduleCommentContentType = "inconsistency" | "observation" | "improvement";

export interface RescheduleCommentResponseGET {
  id: number;
  content_type: RescheduleCommentContentType;
  object_id: number;
  comment_author: string;
  comment_text: string;
  old_date: string | null;
  new_date: string | null;
  action_type: "correction" | "corrective_action" | "solution" | null;
  action_index: number | null;
  created_at: string;
}

export interface RescheduleCommentRequestPOST {
  content_type: RescheduleCommentContentType;
  object_id: number;
  comment_author: string;
  comment_text: string;
  old_date?: string | null;
  new_date?: string | null;
  action_type?: "correction" | "corrective_action" | "solution" | null;
  action_index?: number | null;
}

export enum SnackbarType {
  error = "error",
  success = "success",
}
