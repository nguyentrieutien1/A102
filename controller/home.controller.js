import { getLocalStorage } from "../helpers/local-storage.js"
import { POLLS_STORAGE_KEY, QUESTION_TITLE_LOCAL_STORAGE_KEY } from "../constants/local-storage-key.js"
const homeContainer = $(".home-container");
const createPollConstainer = $(".create-poll-container");
const listPollContainer = $(".list-poll-container");
export const POLL = 3;
let poll = (getLocalStorage(POLLS_STORAGE_KEY)?.length > 0 && getLocalStorage(POLLS_STORAGE_KEY)[POLL]) || []
// Clear dirty questions data before render
const handleClearQuestionsDataBeforeRender = (questions) => {
  return questions?.length > 0 ? questions.filter(q => q.answers.length > 0 && q.answers.every(q => q.value) && q.question) : []
}


// Show home page when you vist fisrt
(() => {
  $(homeContainer).removeClass("d-none");
  $(homeContainer).addClass("d-block");
})();


// Switch navbar
(() => {
  const linksElement = $(".nav-link")
  linksElement.each((_, link) => {
    $(link).click(() => {
      const id = link.getAttribute("data-id");
      if (id == 0) {
        $(homeContainer).removeClass("d-none");

        $(createPollConstainer).addClass("d-none");
        $(createPollConstainer).removeClass("d-block");

        $(listPollContainer).addClass("d-none");
        $(listPollContainer).removeClass("d-block");

        let poll = (getLocalStorage(POLLS_STORAGE_KEY)?.length > 0 && getLocalStorage(POLLS_STORAGE_KEY)[POLL]) || []
        const questionsAfterCleared = handleClearQuestionsDataBeforeRender(poll?.questions)
        homeContainer.html(` <h1 class="mt-5" id="poll-name">${poll?.pollTitle || ""}</h1>`)
        homeContainer.append(showQuestion(questionsAfterCleared))

        if (questionsAfterCleared?.length > 0) {
          $(".retain-btn").removeClass("d-none");
        }
      }
      else if (id == 1) {

        $(createPollConstainer).removeClass("d-none");
        $(createPollConstainer).addClass("d-block");

        $(homeContainer).removeClass("d-block");
        $(homeContainer).addClass("d-none");

        $(listPollContainer).removeClass("d-block");
        $(listPollContainer).addClass("d-none");


        $(".name_poll_container").addClass("d-none")
        $(".retain-btn").addClass("d-none");

      }
      else {

        $(listPollContainer).addClass("d-block");
        $(listPollContainer).removeClass("d-none");

        $(homeContainer).addClass("d-none");
        $(homeContainer).removeClass("d-block");

        $(createPollConstainer).addClass("d-none");
        $(createPollConstainer).removeClass("d-block");


        $(".retain-btn").addClass("d-none");
      }
    })
  })
})();


const showQuestion = (questions) => {
  return questions.length == 0 ? "<h1>List is empty !</h1>" : questions.map((question, index) => {
    return `
    <div class="${question?.id}">
          <div class="home-questions mt-5">
            <div class="question">
              <div class="question-text d-flex align-content-center">
                <span>${++index}. ${question.question || ""}</span>${question?.mandotory ? `<span class="text-danger ms-1">*</span>` : ""}
              </div>
  
              ${question.answers.map((answer, index) => `<div class="checkbox mt-3">
                <label for="${question?.id}" >
                  <input name="${question?.id}"  ${question?.answersUser?.length > 0 && question?.answersUser[index]?.value && "checked"} class="answer-question" data-question-id="${question?.id}" data-answer-id="${answer?.id}" type="${question?.multiple_optionals ? "checkbox" : "radio"}"  name="exclusiveCheckbox">
                  ${answer?.value}
                </label>
              </div>`).join(" ")}
            </div>
          </div>
        </div>`
  })
}

// Render questions
(() => {
  console.log(poll);
  const questionsAfterCleared = handleClearQuestionsDataBeforeRender(poll?.questions);
  homeContainer.html(` <h1 class="mt-5" id="poll-name">${poll?.pollTitle || ""}</h1>`)
  homeContainer.append(showQuestion((questionsAfterCleared)))
  if (questionsAfterCleared?.length > 0) {
    $(".retain-btn").removeClass("d-none");
  }
})();
