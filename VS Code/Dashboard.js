let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// 🔐 Login check (only dashboard)
if (!currentUser) {
    alert("Please login first");
    window.location.href = "login.html";
}

// 🎭 Role control
window.onload = function () {

    if (currentUser.role === "student") {

    // Add Student section hide
    document.querySelector(".container").style.display = "none";

    // Delete buttons hide
    document.getElementById("top-Actions").style.display = "none";

    // Attendance action buttons hide
    let style = document.createElement("style");

    style.innerHTML = `
        .present,
        .absent,
        .delete {
            display: none;
        }
    `;

    document.head.appendChild(style);
}

 displayStudents();

    // default date
    let dateInput = document.getElementById("attendanceDate");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
    }
};

// Data
let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

let rollInput = document.getElementById("roll");
let nameInput = document.getElementById("name");
let courseInput = document.getElementById("course");

// Add Student
 function addStudent() {
    let roll = rollInput.value;
    let name = nameInput.value;
    let course = courseInput.value;

    if (!roll || !name || !course) {
        alert("Fill all fields");
        return;
    }

    students.push({ roll, name, course });
    localStorage.setItem("students", JSON.stringify(students));

    rollInput.value = "";
    nameInput.value = "";
    courseInput.value = "";

    displayStudents();
}

// Attendance
   
 function markAttendance(roll, status) {

    let selectedDate = document.getElementById("attendanceDate").value;

    if (!selectedDate) {
        alert("Select date first");
        return;
    }

    let existing = attendance.find(a => a.roll == roll && a.date == selectedDate);

    if (existing) {
        existing.status = status;
    } else {
        attendance.push({ roll, date: selectedDate, status });
    }

    localStorage.setItem("attendance", JSON.stringify(attendance));

    displayStudents();
}

// Display
function displayStudents() {

    let table = document.getElementById("table");
    table.innerHTML = "";

    let selectedDate = document.getElementById("attendanceDate").value;

    if (!selectedDate) {
        selectedDate = new Date().toISOString().split("T")[0];
    }

    students.forEach((s) => {

        let todayData = attendance.find(a => a.roll == s.roll && a.date == selectedDate);
        let status = todayData ? todayData.status : "Not Marked";

        table.innerHTML += `
        <tr>
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>${s.course}</td>
            <td>
                <button class="present" onclick="markAttendance('${s.roll}','Present')">Present</button>
                <button class="absent" onclick="markAttendance('${s.roll}','Absent')">Absent</button>
            </td>
            <td>${status}</td>
        </tr>
        `;
    });
}

// Delete
 function deleteStudent(roll) {
    students = students.filter(s => s.roll != roll);
    attendance = attendance.filter(a => a.roll != roll);

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));

    displayStudents();
}

// Search
 function searchByDate() {
    let date = document.getElementById("searchDate").value;
    let table = document.getElementById("table");
    table.innerHTML = "";

    let found = false;

    students.forEach((s) => {
        let record = attendance.find(a => a.roll == s.roll && a.date == date);

        if (record) {
            found = true;

            table.innerHTML += `
            <tr>
                <td>${s.roll}</td>
                <td>${s.name}</td>
                <td>${s.course}</td>
                <td>-</td>
                <td>${record.status}</td>
            </tr>
            `;
        }
    });

    if (!found) {
        table.innerHTML = `<tr><td colspan="5">No data found</td></tr>`;
    }
}

// Monthly Report
 function monthlyReport() {
  let monthInput = document.getElementById("searchMonth").value;
    let table = document.getElementById("monthlyTable");
    table.innerHTML = "";
    let studentMap = {};
    attendance.forEach((a) => {
        if (a.date.startsWith(monthInput)) {
           if (!studentMap[a.roll]) {
                let student = students.find(s => s.roll == a.roll);
                    studentMap[a.roll] = {
                    roll: a.roll,
                    name: student.name,
                    course: student.course,
                    present: 0,
                    absent: 0
                };
            }
             if (a.status === "Present") studentMap[a.roll].present++;
            else if (a.status === "Absent") studentMap[a.roll].absent++;
        }
    });
      let found = false;
        for (let key in studentMap) {
        found = true;
        let s = studentMap[key];
        table.innerHTML += `
        <tr>
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>${s.course}</td>
            <td>${s.present}</td>
            <td>${s.absent}</td>
        </tr>
        `;
    }
       if (!found) {
        table.innerHTML = `<tr><td colspan="5">No Data Found</td></tr>`;
    }
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function showDeleteList(type){

    let deleteBox = document.getElementById("deleteListBox");
    let deleteList = document.getElementById("deleteList");

    deleteBox.style.display = "block";

    deleteList.innerHTML = "";

    // STUDENT DELETE
    if(type === "student"){

        students.forEach((s)=>{

            deleteList.innerHTML += `
            <li style="margin:10px;">
                ${s.roll} - ${s.name}

                <button onclick="deleteStudentData('${s.roll}')">
                    Delete
                </button>
            </li>
            `;
        });
    }

    // TEACHER DELETE
    else if(type === "teacher"){

        let users = JSON.parse(localStorage.getItem("users")) || [];

        users.forEach((u)=>{

            if(u.role === "teacher"){

                deleteList.innerHTML += `
                <li style="margin:10px;">
                    ${u.username}

                    <button onclick="deleteTeacher('${u.username}')">
                        Delete
                    </button>
                </li>
                `;
            }
        });
    }
}
 // change
 function deleteStudentData(roll){

    students = students.filter(s => s.roll != roll);

    attendance = attendance.filter(a => a.roll != roll);

   localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
    
    displayStudents();

    alert("Student Deleted");
}
 
 function deleteTeacher(username){

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.filter(u => u.username != username);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Teacher Deleted");
} 