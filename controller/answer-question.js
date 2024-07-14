import { POLLS_STORAGE_KEY, QUESTION_LOCAL_STORAGE_KEY } from "../constants/local-storage-key.js";
import { getLocalStorage, setLocalStorage } from "../helpers/local-storage.js";
import { toast } from "../helpers/toast.js";
import { POLL } from "./home.controller.js";

// Handle answer the quesion
(() => {
  $(".retain-btn").click(() => {

    try {
      let poll = getLocalStorage(POLLS_STORAGE_KEY)[POLL] || []
      const answers = []
      let isCorrectAnswer = true

      $(".answer-question").each((index, input) => {
        const { checked } = input;
        const questionID = $(input).attr("data-question-id");
        const answerID = $(input).attr("data-answer-id");

        const userAnswer = {
          questionID,
          answerID,
          value: checked,
        }
        answers.push(userAnswer)
      })
      poll = poll?.questions.filter(q => q.answers.length > 0 && q.answers.every(q => q.value) && q.question).map(q => {
        q.answersUser = []
        const findQuestion = answers.filter(a => a?.questionID === q?.id)
        if (findQuestion) {
          q.answersUser = [...findQuestion]
        }
        return q;
      })

      poll.forEach(p => {
        if (p?.mandotory && !p.answersUser.some(a => a.value)) {
          $(`#error-message-${p?.id}`).html("(This field is require, please choose !)");
          isCorrectAnswer = false
        }
        else {
          $(`#error-message-${p?.id}`).html("")
        }
      })
      if (isCorrectAnswer) {
        const polls = getLocalStorage(POLLS_STORAGE_KEY);
        polls[POLL]["questions"] = poll;
        setLocalStorage(POLLS_STORAGE_KEY, polls)
        toast("Retain answer", "Retain answer successful !")
      }

    } catch (error) {
      console.log(error);
      toast("Retain answer", "Retain answer fail !", "error")
    }
  })
})();
