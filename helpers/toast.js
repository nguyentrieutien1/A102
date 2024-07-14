const toast = (title, message, type = "success") => {
  var toastEl = document.getElementById('basicToast');
  $(".toast-body").html(message)
  $(".toast-title").html(title)
  $(".toast-header").addClass(`bg-${type}`)
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}
export {
  toast
}
