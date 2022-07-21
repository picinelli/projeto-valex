function createCardInfo(employeeId = 1, type = "groceries") {
  return {
    employeeId,
    type
  }
}

const cardsFactory = {
  createCardInfo
}

export default cardsFactory