export interface UiState {
    currentError?: string;
    loadingData: boolean;
    appOffline: boolean;
}

export const INITIAL_UI_STATE: UiState = {
  currentError: '',
  loadingData: false,
  appOffline: false
};
