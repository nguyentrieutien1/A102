
// Show Polls

import { POLLS_STORAGE_KEY } from "../constants/local-storage-key.js";
import { getLocalStorage, setLocalStorage } from "../helpers/local-storage.js";

let polls = getLocalStorage(POLLS_STORAGE_KEY) || []

// Show polls
export const showPolls = (polls, status) => {
  console.log(polls);
  console.log(status);
  const pollElement = $("#polls")
  const mapPoll = [...polls].filter(p => p?.status === status).map((poll, index) => {
    return `<tr>
              <td>${index + 1}</td>
              <td>${poll.pollTitle}</td>
              <td class="text-center">
              <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${`modal-${poll?.pollID}`}" type="button" data-id="${index}" name="view-result" class="action-btn btn btn-info text-white">View results</button>
              <button type="button" data-id="${poll?.pollID}"  name="closed" class="action-btn btn btn-warning text-white close-poll-btn">Close poll</button>
             <button type="button"  class="btn btn-danger action-btn" name="delete" data-bs-toggle="modal" data-bs-target="#${`delete-${poll?.pollID}`}">
  Delete
</button>

<div class="modal fade" id="${`delete-${poll?.pollID}`}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Do you want to remove ${poll?.pollTitle} poll ?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button  data-id="${poll?.pollID}" type="button" class="btn btn-primary delete-btn"  data-bs-dismiss="modal">Save</button>
      </div>
    </div>
  </div>
</div>
<!-- Modal -->
<div class="modal fade" id="${`modal-${poll?.pollID}`}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${poll?.pollTitle}</h5>
        <button type="button" class="btn-close"></button>
      </div>
      <div class="modal-body">
      ${poll?.questions.map(question => {
      return `
    <div class="${question?.id}">
          <div class="home-questions mt-5">
            <div class="question">
              <div class="question-text d-flex align-items-center">
                <span>${++index}. ${question.question || ""}</span>${question?.mandotory ? `<span class="text-danger ms-1">*</span>` : ""}
                <div class="text-danger"  id="error-message-${question?.id}"></div>
              </div>
  
              ${question.answers.map((answer, index) => `<div class="checkbox mt-3 text-start">
                <label for="${question?.id}" >
                  <input name="${question?.id}"  ${question?.answersUser?.length > 0 && question?.answersUser[index]?.value && "checked"} class="answer-question" data-question-id="${question?.id}" data-answer-id="${answer?.id}" type="${question?.multiple_optionals ? "checkbox" : "radio"}"  name="exclusiveCheckbox">
                  ${answer?.value}
                </label>
              </div>`).join(" ")}
            </div>
          </div>
        </div>`
    })}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
              </td>`
  })
  pollElement.html(mapPoll)
  handleActionButtonClick()
}
let tabName = "active";

// Switch tabs
(() => {
  $(".poll-nav-item").each((index, item) => {
    $(item).click(() => {

      let polls = getLocalStorage(POLLS_STORAGE_KEY) || []
      if (index === 0) {
        tabName = "active"
        showPolls(polls, tabName)
      }
      else if (index === 1) {
        tabName = "drafts"
        showPolls(polls, "delete")
      }
      else {
        tabName = "closed"
        showPolls(polls, tabName)
      }
    })

  })

})();

// Handle close poll
const handleActionButtonClick = () => {
  const actionButtons = $(".action-btn")
  actionButtons.each((_, btn) => {
    $(btn).click(() => {
      const { name } = btn
      const pollID = $(btn).attr("data-id");
      if (name === "delete") {
        const btns = document.querySelectorAll(".delete-btn")
        btns.forEach(btn => {
          btn.addEventListener("click", () => {
            const pollID = btn.getAttribute("data-id")
            console.log(pollID);
            polls = polls.map(p => {
              if (p?.pollID === pollID) {
                p["status"] = name
              }
              return p
            })
            showPolls(polls, tabName)
            setLocalStorage(POLLS_STORAGE_KEY, polls)
          })
        })
      }
      else if (name === "closed") {
        polls = polls.map(p => {
          if (p?.pollID === pollID) {
            p["status"] = name
          }
          return p
        })
      }
      showPolls(polls, tabName)
      setLocalStorage(POLLS_STORAGE_KEY, polls)
    })
  })
}


// Handle delete poll


// App
const app = () => {
  showPolls(polls, tabName)
  $(".poll-nav-item").each((index, item) => {
    $(item).removeClass("active")
    if (index === 0) {
      $(item).addClass("active")
    }
  })
}

app()
