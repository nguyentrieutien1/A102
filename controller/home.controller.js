import { getLocalStorage } from "../helpers/local-storage.js"
import { QUESTION_LOCAL_STORAGE_KEY, QUESTION_TITLE_LOCAL_STORAGE_KEY } from "../constants/local-storage-key.js"
const homeContainer = $(".home-container");
const createPollConstainer = $(".create-poll-container");
const listPollContainer = $(".list-poll-container");

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

        let quetions = getLocalStorage(QUESTION_LOCAL_STORAGE_KEY) || []
        quetions = quetions.filter(q => q.answers.length > 0 && q.question)
        console.log(quetions);
        homeContainer.html(`<h1 class="mt-5">${getLocalStorage(QUESTION_TITLE_LOCAL_STORAGE_KEY)}</h1>`)
        homeContainer.append(showQuestion(quetions))
      }
      else if (id == 1) {

        $(createPollConstainer).removeClass("d-none");
        $(createPollConstainer).addClass("d-block");

        $(homeContainer).removeClass("d-block");
        $(homeContainer).addClass("d-none");

        $(listPollContainer).removeClass("d-block");
        $(listPollContainer).addClass("d-none");

        console.log($(".name_poll_container"));

        $(".name_poll_container").attr("value", getLocalStorage(QUESTION_TITLE_LOCAL_STORAGE_KEY));

      }
      else {

        $(listPollContainer).addClass("d-block");
        $(listPollContainer).removeClass("d-none");

        $(homeContainer).addClass("d-none");
        $(homeContainer).removeClass("d-block");

        $(createPollConstainer).addClass("d-none");
        $(createPollConstainer).removeClass("d-block");
      }
    })
  })
})();


const showQuestion = (questions) => {
  $("#poll-name").html(getLocalStorage(QUESTION_TITLE_LOCAL_STORAGE_KEY))
  return questions.length == 0 ? "<h1>List is empty !</h1>" : questions.map((question, index) => {
    return `<div class="${question?.id}">
          <div class="home-questions mt-5">
            <div class="question">
              <div class="question-text d-flex align-content-center">
                <span>${++index}. ${question.question || ""}</span>${question?.mandotory ? `<span class="text-danger ms-1">*</span>` : ""}
              </div>
  
              ${question.answers.map(answer => `<div class="checkbox mt-3">
                <label>
                  <input type="${question?.multiple_optionals ? "checkbox" : "radio"}" value="" name="exclusiveCheckbox">
                  ${answer?.value}
                </label>
              </div>`).join(" ")}
            </div>
          </div>
        </div>`
  })
}

// Render quetions
(() => {
  let quetions = getLocalStorage(QUESTION_LOCAL_STORAGE_KEY) || []
  quetions = quetions.filter(q => q.answers.length > 0 && q.question)
  homeContainer.append(showQuestion((quetions)))
})();
