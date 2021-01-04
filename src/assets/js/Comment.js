import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

//Adding Comment
const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");
  span.innerHTML = comment;
  button.innerHTML = "❌";
  button.className = "jsDeleteButton";
  button.addEventListener("click", handleDelete);
  li.appendChild(span);
  li.appendChild(button);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  console.log(event);
  sendComment(comment);
  commentInput.value = "";
};

//Removing Comment
const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const deleteComment = (li) => {
  li.parentNode.removeChild(li);
  decreaseNumber();
};

const sendDelete = async (li) => {
  const comment = li.firstChild.innerHTML;
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/delete`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    deleteComment(li);
  }
};

const handleDelete = (event) => {
  const li = event.target.parentNode;
  sendDelete(li);
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  let commentDelBtn = Array.from(
    commentList.getElementsByClassName("jsDeleteButton")
  );
  commentDelBtn.forEach((delBtn) => {
    delBtn.addEventListener("click", handleDelete);
  });
}

if (addCommentForm && commentList) {
  init();
}
