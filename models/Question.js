import { generateUUID } from "../helpers/uuid.js"

class Question {
  constructor() {
    this.id = generateUUID()
    this.answers = []
    this.mandotory = false
    this.multiple_optionals = false
    this.numberQuestion = 1
  }
}
export {
  Question
}
