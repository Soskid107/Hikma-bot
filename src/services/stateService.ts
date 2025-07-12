
// src/services/stateService.ts

/**
 * A simple in-memory state machine to track user states (e.g., awaiting input).
 */

// Define possible user states
export enum UserState {
  AWAITING_HEALING_GOALS = 'awaiting_healing_goals',
  AWAITING_JOURNAL_ENTRY = 'awaiting_journal_entry',
  AWAITING_JOURNAL_EDIT = 'awaiting_journal_edit',
  AWAITING_TIP_INPUT = 'awaiting_tip_input',
  AWAITING_CUSTOM_REMINDER_TIME = 'awaiting_custom_reminder_time',
  AWAITING_CUSTOM_TIP_INTERVAL = 'awaiting_custom_tip_interval',
  AWAITING_FEEDBACK = 'awaiting_feedback',
}

interface StateContext {
  state: UserState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; // Optional data to store with the state (e.g., entryId for editing)
}

const userStates = new Map<number, StateContext>();

export function setUserState(userId: number, state: UserState, data?: any): void {
  userStates.set(userId, { state, data });
}

export function getUserState(userId: number): StateContext | undefined {
  return userStates.get(userId);
}

export function clearUserState(userId: number): void {
  userStates.delete(userId);
}
