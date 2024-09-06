const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const userPhoneInput = document.getElementById("userPhone");
const userJobInput = document.getElementById("userJob");
const submitBtn = document.getElementById("submitBtn");
const form = document.querySelector("form");
const tableContent = document.getElementById("tableContent");
const noDataText = document.getElementById("noData");
let userNameMsg = document.getElementById("userNameMsg");
let emailMsg = document.getElementById("emailMsg");
let phoneMsg = document.getElementById("phoneMsg");
let jobMsg = document.getElementById("jobMsg");
let usersList = [];
let btnStatus = "Add User";

// check local storage is empty or not
if (localStorage.getItem("usersData") !== null) {
  usersList = getUsersFromLocalStorage();
  displayUsersInfo();
}
// Save users to local storage
function saveUsersToLocalStorage() {
  localStorage.setItem("usersData", JSON.stringify(usersList));
}
// Get users from local storage
function getUsersFromLocalStorage() {
  const usersData = localStorage.getItem("usersData")
    ? JSON.parse(localStorage.getItem("usersData"))
    : [];
  return usersData;
}

// prevent default to form
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

submitBtn.addEventListener("click", () => {
  if (validateForm()) {
    addUserInfo();
    displayUsersInfo();
    resetInputs();
  }
});

// add user
function addUserInfo() {
  let userInfo = {
    id: btnStatus === "Add User" ? Date.now() : Number(submitBtn.dataset.id),
    userName: userNameInput.value,
    userEmail: userEmailInput.value,
    userPhone: userPhoneInput.value,
    userJob: userJobInput.value,
  };
  if (btnStatus === "Add User") {
    usersList.push(userInfo);
  } else {
    usersList = usersList.map((user) =>
      user.id === userInfo.id ? userInfo : user
    );
    btnStatus = "Add User";
    submitBtn.innerHTML = "Add User";
    submitBtn.removeAttribute("data-id");
  }
  saveUsersToLocalStorage();
}

// display users
function displayUsersInfo() {
  let content = ``;
  for (let i = 0; i < usersList.length; i++) {
    content += `
         <tr>
            <td class="fw-bold">${i + 1}</td>
            <td>${usersList[i].userName}</td>
            <td>${usersList[i].userEmail}</td>
            <td>${usersList[i].userPhone}</td>
            <td>${usersList[i].userJob}</td>
            <td class="d-flex justify-content-center align-items-center">
                <button id="editBtn" class="btn bg-info text-white"  onclick="editUser(${
                  usersList[i].id
                })">
                <i class="bx bx-edit-alt"></i>
                </button>
                <button id="deleteBtn" class="btn bg-danger text-white" onclick="deleteUser(${
                  usersList[i].id
                })">
                <i class="bx bx-trash"></i>
                </button>
            </td>
        </tr>
        `;
  }
  tableContent.innerHTML = content;
}

// reset inputs
function resetInputs() {
  userNameInput.value = "";
  userEmailInput.value = "";
  userPhoneInput.value = "";
  userJobInput.value = "";
  // Remove validation classes from all inputs
  userNameInput.classList.remove("is-valid", "is-invalid");
  userEmailInput.classList.remove("is-valid", "is-invalid");
  userPhoneInput.classList.remove("is-valid", "is-invalid");
  userJobInput.classList.remove("is-valid", "is-invalid");
}

// delete user
function deleteUser(id) {
  usersList = usersList.filter((user) => user.id !== id);
  saveUsersToLocalStorage();
  displayUsersInfo();
}

//edit user
function editUser(id) {
  let user = usersList.find((user) => user.id === id);
  userNameInput.value = user.userName;
  userEmailInput.value = user.userEmail;
  userPhoneInput.value = user.userPhone;
  userJobInput.value = user.userJob;
  btnStatus = "Edit User";
  submitBtn.innerHTML = "Save Changes";
  submitBtn.setAttribute("data-id", id);
  userNameInput.focus();
}

// Validate inputs
function validateInputs(value, regex, messageElement, inputElement) {
  if (regex.test(value.trim())) {
    messageElement.classList.add("d-none");
    inputElement.classList.add("is-valid");
    inputElement.classList.remove("is-invalid");
    return true;
  } else {
    messageElement.classList.remove("d-none");
    inputElement.classList.add("is-invalid");
    inputElement.classList.remove("is-valid");
    return false;
  }
}

// Validate form inputs
function validateForm() {
  const isValidName = validateInputs(
    userNameInput.value,
    /^[a-zA-Z\s]{3,16}$/,
    userNameMsg,
    userNameInput
  );
  const isValidEmail = validateInputs(
    userEmailInput.value,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    emailMsg,
    userEmailInput
  );
  const isValidPhone = validateInputs(
    userPhoneInput.value,
    /^01[0125]\d{8}$/,
    phoneMsg,
    userPhoneInput
  );
  const isValidJob = validateInputs(
    userJobInput.value,
    /^[a-zA-Z\s]+$/,
    jobMsg,
    userJobInput
  );
  return isValidName && isValidEmail && isValidPhone && isValidJob;
}
// Event listeners
userNameInput.addEventListener("input", validateForm);
userEmailInput.addEventListener("input", validateForm);
userPhoneInput.addEventListener("input", validateForm);
userJobInput.addEventListener("input", validateForm);

// search
function searchByUserName() {
  const searchInputValue = searchInput.value.trim().toLowerCase();
  let content = ``;
  for (let i = 0; i < usersList.length; i++) {
    if (usersList[i].userName.toLowerCase().includes(searchInputValue)) {
      content += `
        <tr>
              <td class="fw-bold">${i + 1}</td>
              <td>${usersList[i].userName}</td>
              <td>${usersList[i].userEmail}</td>
              <td>${usersList[i].userPhone}</td>
              <td>${usersList[i].userJob}</td>
              <td class="d-flex justify-content-center align-items-center">
                  <button id="editBtn" class="btn bg-info text-white"  onclick="editUser(${
                    usersList[i].id
                  })">
                  <i class="bx bx-edit-alt"></i>
                  </button>
                  <button id="deleteBtn" class="btn bg-danger text-white" onclick="deleteUser(${
                    usersList[i].id
                  })">
                  <i class="bx bx-trash"></i>
                  </button>
              </td>
        </tr>`;
    }
  }
  tableContent.innerHTML =
    content ||
    `<tr><td colspan="6" class="text-center fw-bold text-danger">No Data Found Matching with your search</td></tr>`;
}
searchInput.addEventListener("input", searchByUserName);