// Basic, framework-agnostic form validators.
// Business-rule specific validation belongs closer to each feature.

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? '')
}

export function minLength(value, min) {
  return String(value ?? '').length >= min
}
