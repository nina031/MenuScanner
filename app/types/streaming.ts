// Type décrivant les étapes de traitement du streaming du menu
export type ProcessingStep =
  | 'uploading'
  | 'detecting_sections'
  | 'processing_section'
  | 'complete'
  | 'error';
