import { getLocalStorage, setLocalStorage } from "../helpers/local-storage.js"
import { Question } from "../models/Question.js"
import { generateUUID } from "../helpers/uuid.js"
import { POLLS_STORAGE_KEY, QUESTION_LOCAL_STORAGE_KEY, QUESTION_TITLE_LOCAL_STORAGE_KEY } from "../constants/local-storage-key.js";
import { convertNumberToArray } from "../helpers/convert-number-to-array.js"
import { toast } from "../helpers/toast.js";

// Init default value in list with length = 1;
let listQuestion = getLocalStorage(QUESTION_LOCAL_STORAGE_KEY) || []

// Get element contain the questions
const questionContentElement = $(".question_content");

// Show all quesion
const showAllQuesion = (listQuestion) => {
  return listQuestion.map(question => {
    return `<div id="question-${question.id}">
        <div class="border my-4"></div>
        <div class="">
          <div class="col-10 m-auto">
            <!-- Question input -->
            <input name="question" value="${question?.question || ""}"  data-id="${question.id}" data-id="${question.id}" type="text" class="form-control question-input" aria-describedby="helpId"
              placeholder="Enter your question" />
              <div class="text-danger mt-1 error-question-${question?.id}"></div>
            <div>
              <div class="form-check  my-4">
                <input ${question?.mandotory && "checked"} data-id="${question.id}" name="mandotory" class="form-check-input" type="checkbox" id="mandotory-${question.id}" />
                <label class="form-check-label" for="mandotory-${question.id}"> mandotory </label>
              </div>
              <div class="form-check">
                <input  ${question?.multiple_optionals && "checked"}   name="multiple_optionals" class="form-check-input" type="checkbox"
                  id="multiple_optionals-${question.id}"  data-id="${question.id}"/>
                <label class="form-check-label" for="multiple_optionals-${question.id}"> You can select multiple optionals </label>
              </div>
  
             ${convertNumberToArray(question?.numberQuestion).map((number, index) => ` <div class="form-check my-1 d-flex align-items-center p-0" style="height: 40px">
                <div class="p-0 me-3">Answers</div>
                <input data-answer-id="${question?.answers[index]?.id || generateUUID()}" value="${question?.answers[index]?.value || ""}" data-id="${question?.id}" placeholder = "Type your answer" name = "answer" class= "form-control h-100 rounded-end-0 w-75 answer-input" type = "text" id = "mandotory" />
    <i class="add-answer-btn fa-solid fa-plus bg-success text-white h-100 text-center pointer-event"
      style="width: 40px; line-height: 40px" data-id="${question?.id}"></i>
              </div >
              <div class="text-danger text-left anwer-error-message-${question?.answers[index]?.id || generateUUID()}}"></div>
              `).join(" ")}
            </div>
          </div>
          <!--End create Interview -->
        </div>
        </div>
        `
  })

}

// Handle input question data
const handleQuestionData = () => {

  const allInput = $("input");
  const addAnswerButton = $(".add-answer-btn")

  // Add answer
  addAnswerButton.each((_, button) => {
    $(button).click(function () {
      const id = this.getAttribute("data-id")
      const updateQuestion = listQuestion.map(q => {
        if (q?.id === id) {
          q.numberQuestion += 1;
        }
        return q
      });

      setLocalStorage(QUESTION_LOCAL_STORAGE_KEY, updateQuestion)

      questionContentElement.html(showAllQuesion(updateQuestion));

      handleQuestionData();
    })
  })


  // Handle question and answer input change
  allInput.each((_, input) => {
    $(input).change(function () {
      const answerID = this.getAttribute("data-answer-id")
      const id = this.getAttribute("data-id")

      const { name, value, checked } = this;
      const updateQuestion = listQuestion.map(q => {

        // If input have name === answer, push answer to list of this question
        if (q?.id === id && name === "answer") {
          const answerIndex = q.answers?.findIndex(a => a.id === answerID)
          if (answerIndex === -1) {
            const listAnswer = q.answers;
            listAnswer.push({ id: answerID, value })
            q.answers = [...listAnswer]
          }
          else {
            q.answers[answerIndex]["value"] = value
          }
          return { ...q }
        }

        // if name === question, assign text value, else assign checkbox value
        else if (q?.id === id) {
          q[name] = (name === "question") ? value : checked
        }
        else if (name === "name_poll") {
          setLocalStorage(QUESTION_TITLE_LOCAL_STORAGE_KEY, value)
        }
        return { ...q }
      });

      // Show again question updated to get lastest DOM
      showAllQuesion(updateQuestion)

      // Store question updated
      setLocalStorage(QUESTION_LOCAL_STORAGE_KEY, updateQuestion)
    });
  })
}


// Show first question DOM
const addQuestion = () => {
  questionContentElement.append(showAllQuesion(listQuestion));
  $(".name_poll_container").html(getLocalStorage(QUESTION_TITLE_LOCAL_STORAGE_KEY))
}

const showPoll = () => {
  addQuestion();
  setLocalStorage(QUESTION_LOCAL_STORAGE_KEY, listQuestion);
  handleQuestionData();
}
showPoll();
// Handle add question
(() => {

  // Initial elements
  const addQuestionButton = $(".add_question_btn");
  const addPollButton = $(".add_poll_btn");

  addPollButton.click(() => {
    const poll = getLocalStorage(POLLS_STORAGE_KEY) || []
    const question = getLocalStorage(QUESTION_LOCAL_STORAGE_KEY) || []

    poll.push({ status: "active", pollID: generateUUID(), pollTitle: document.querySelector(".name_poll_container").value, questions: question })

    setLocalStorage(POLLS_STORAGE_KEY, poll)
    setLocalStorage(QUESTION_TITLE_LOCAL_STORAGE_KEY, "")
    setLocalStorage(QUESTION_LOCAL_STORAGE_KEY, [])
    questionContentElement.html(showAllQuesion([]));

    if (question.length > 0) {
      toast("Create poll", "Poll was created successful !")
    }
    else {
      toast("Create poll", "Question not be empty !", "warning")
    }
    $(".name_poll_container").addClass("d-none")
  })

  addQuestionButton.click(() => {

    // Handle valid input data
    $(".name_poll_container").removeClass("d-none")
    checkValidInput()

  })

})();


// Function valid input 
const checkValidInput = () => {
  let isAllowCreateQuestion = true;
  const quesionInput = document.querySelectorAll(".question-input")
  const answerElements = document.querySelectorAll(".answer-input")


  quesionInput.forEach(question => {
    const { name, value } = question
    if (!value) {
      question.nextElementSibling.innerHTML = `${name} cannot be empty !`
      isAllowCreateQuestion = false;
    }
    else {
      question.nextElementSibling.innerHTML = ""
    }
  })
  answerElements.forEach(answer => {
    const { name, value } = answer
    if (!value) {
      answer.parentElement.nextElementSibling.innerHTML = `${name} cannot be empty !`
      isAllowCreateQuestion = false;
    }
    else {
      answer.parentElement.nextElementSibling.innerHTML = ""
    }
  })
  if (isAllowCreateQuestion) {
    listQuestion.push(new Question());
    questionContentElement.html(showAllQuesion(listQuestion));
    handleQuestionData();
    setLocalStorage(QUESTION_LOCAL_STORAGE_KEY, listQuestion);
    toast("Create question", "Question was created successful !")
  }
}
