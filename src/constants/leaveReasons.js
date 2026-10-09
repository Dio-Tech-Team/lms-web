// Common reasons shown as dropdown options. "Other" opens a text box.
// Every reason is optional — HR may leave it blank.
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

export const MONETIZATION_REJECTION_REASONS = [
  'Remaining balance would fall below the required minimum',
  'Insufficient leave credits',
  'No available funds for monetization at this time',
  'Requested days exceed the allowable limit',
  'Incomplete supporting documents or justification',
  'Duplicate request',
]

export const MONETIZATION_CANCELLATION_REASONS = [
  'Approved in error',
  'Employee withdrew the request',
  'Funds no longer available',
  'Wrong number of days approved; to be re-filed',
  'Duplicate request',
]
export const OTHER_REASON = 'Other'

// Turns the dropdown choice + optional text into the string sent to the API.
// Returns null when nothing was given, since the reason is optional.
export function buildReason(selected, otherText = '') {
  if (!selected) return null
  if (selected === OTHER_REASON) {
    const text = (otherText || '').trim()
    return text ? `Other: ${text}` : null
  }
  return selected
}
