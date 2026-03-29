// Chilean RUT validation and formatting utilities

/**
 * Validates the check digit (dígito verificador) of a Chilean RUT
 */
export function validateRutCheckDigit(rut: string): boolean {
  // Remove all non-alphanumeric characters
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  
  if (cleanRut.length < 2) return false
  
  const body = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1)
  
  // Calculate expected check digit
  let sum = 0
  let multiplier = 2
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const remainder = sum % 11
  const expectedDv = remainder === 0 ? '0' : remainder === 1 ? 'K' : String(11 - remainder)
  
  return dv === expectedDv
}

/**
 * Formats a RUT string to XX.XXX.XXX-X format
 */
export function formatRut(value: string): string {
  // Remove all non-alphanumeric characters
  let cleanValue = value.replace(/[^0-9kK]/g, '').toUpperCase()
  
  if (cleanValue.length === 0) return ''
  
  // Separate body and check digit
  let body = cleanValue.slice(0, -1)
  const dv = cleanValue.slice(-1)
  
  // Add dots to body (from right to left)
  let formattedBody = ''
  for (let i = body.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      formattedBody = '.' + formattedBody
    }
    formattedBody = body[i] + formattedBody
  }
  
  if (cleanValue.length === 1) {
    return cleanValue
  }
  
  return formattedBody + '-' + dv
}

/**
 * Validates a complete RUT (format and check digit)
 */
export function validateRut(rut: string): { valid: boolean; error?: string } {
  const cleanRut = rut.replace(/[^0-9kK]/g, '')
  
  if (cleanRut.length === 0) {
    return { valid: false, error: 'RUT es requerido' }
  }
  
  if (cleanRut.length < 8 || cleanRut.length > 9) {
    return { valid: false, error: 'RUT debe tener entre 8 y 9 caracteres' }
  }
  
  if (!validateRutCheckDigit(rut)) {
    return { valid: false, error: 'Dígito verificador inválido' }
  }
  
  return { valid: true }
}

/**
 * Validates institutional email format
 */
export function validateInstitutionalEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Correo es requerido' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Formato de correo inválido' }
  }
  
  if (!email.toLowerCase().endsWith('@miucsh.cl')) {
    return { valid: false, error: 'Solo se permiten correos @miucsh.cl' }
  }
  
  return { valid: true }
}
