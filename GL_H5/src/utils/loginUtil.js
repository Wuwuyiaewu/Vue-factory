function isValidAccount(accountNumber) {
  return String(accountNumber).length == 8
}

function isValidCfdReal888RealAccount(accountNumber) {
  return String(accountNumber).startsWith('81')
}

function isValidDjRealAccount(accountNumber) {
  return String(accountNumber).startsWith('831')
}

function isValidHtzRealAccount(accountNumber) {
  return String(accountNumber).startsWith('833')
}

function isValidOsgjRealAccount(accountNumber) {
  return String(accountNumber).startsWith('851')
}

function isValidOszhRealAccount(accountNumber) {
  return String(accountNumber).startsWith('853')
}

function isValidCfdReal888DemoAccount(accountNumber) {
  return String(accountNumber).startsWith('11')
}

function isValidDjDemoAccount(accountNumber) {
  return (
    String(accountNumber).startsWith('131') &&
    String(accountNumber).endsWith('1')
  )
}

function isValidHtzDemoAccount(accountNumber) {
  return (
    String(accountNumber).startsWith('833') &&
    String(accountNumber).endsWith('1')
  )
}

function isValidOsgjDemoAccount(accountNumber) {
  return (
    String(accountNumber).startsWith('851') &&
    String(accountNumber).endsWith('1')
  )
}

function isValidOszhDemoAccount(accountNumber) {
  return (
    String(accountNumber).startsWith('853') &&
    String(accountNumber).endsWith('1')
  )
}

export default {
  isValidRealAccount(accountNumber) {
    return (
      isValidAccount(accountNumber) &&
      (isValidCfdReal888RealAccount(accountNumber) ||
        isValidDjRealAccount(accountNumber) ||
        isValidHtzRealAccount(accountNumber) ||
        isValidOsgjRealAccount(accountNumber) ||
        isValidOszhRealAccount(accountNumber))
    )
  },

  isValidDemoAccount(accountNumber) {
    return (
      isValidAccount &&
      (isValidCfdReal888DemoAccount(accountNumber) ||
        isValidDjDemoAccount(accountNumber) ||
        isValidHtzDemoAccount(accountNumber) ||
        isValidOsgjDemoAccount(accountNumber) ||
        isValidOszhDemoAccount(accountNumber))
    )
  }
}
