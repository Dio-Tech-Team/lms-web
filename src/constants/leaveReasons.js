// Common reasons shown as dropdown options. "Other" opens a text box.
export const REJECTION_REASONS = [
  // Office / service needs
  'Exigency of service: employee needed during the requested dates',
  'Too many personnel from the same office on leave for those dates',
  'No reliever or officer-in-charge designated',
  'Pending deliverables or reports due within the leave period',

  // Filing / documents
  'Filed late (Vacation Leave must be filed at least 5 days before)',
  'Incomplete supporting documents (e.g., medical certificate for sick leave over 5 days)',
  'No approved travel authority for leave to be spent abroad',
  'Wrong leave type selected; please re-file under the correct type',

  // Eligibility / credits
  'Insufficient leave credits',
  'Not eligible for this leave type',
  'Overlaps with an existing approved leave',
]

export const CANCELLATION_REASONS = [
  'Employee reported back to work early',
  'Recalled to duty (exigency of service)',
  'Leave no longer needed',
  'Employee requested cancellation',
  'Filed with wrong dates or leave type',
  'Duplicate application',
]

export const OTHER_REASON = 'Other'

// Turns the dropdown choice + optional text into the string sent to the API
export function buildReason(selected, otherText) {
  if (selected === OTHER_REASON) return `Other: ${otherText.trim()}`
  return selected
}
