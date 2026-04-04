// UniLink inquiry upgrade
// Nâng cấp đầy đủ 5 tính năng:
// 1) Inquiry ID tự động
// 2) Student View Details
// 3) Student Edit / Cancel inquiry
// 4) Admin Assigned Department + Internal Note
// 5) Timeline lịch sử xử lý

const suggestedQuestions = [
  "How can I register for my courses this semester?",
  "I need help checking my tuition payment status.",
  "How do I request my academic transcript?",
  "I forgot my student portal password.",
  "What documents are required for scholarship renewal?",
  "How can I apply for an internship support letter?",
  "Where can I update my personal information?",
  "I need help with dormitory or housing support."
];

let currentUser = null;
let editingInquiryId = null;
let viewingInquiryId = null;

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

function nowString() {
  return new Date().toLocaleString();
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatText(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function slugDepartment(category) {
  const map = {
    "Academic Affairs": "Academic Office",
    "Tuition & Finance": "Finance Office",
    "IT Support": "IT Helpdesk",
    "Scholarship": "Scholarship Office",
    "Housing": "Student Housing",
    "Internship": "Career Services",
    "General Support": "Student Support Center"
  };
  return map[category] || "Student Support Center";
}

function generateInquiryId() {
  const inquiries = getInquiries();
  const year = new Date().getFullYear();
  const prefix = `INQ-${year}-`;

  const numbers = inquiries
    .map(item => item.inquiryCode || "")
    .filter(code => code.startsWith(prefix))
    .map(code => parseInt(code.replace(prefix, ""), 10))
    .filter(num => !Number.isNaN(num));

  const nextNumber = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

function createHistoryEntry(action, actor, note, meta = {}) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    action,
    actor,
    note,
    meta,
    at: nowString()
  };
}

function pushHistory(inquiry, action, actor, note, meta = {}) {
  if (!Array.isArray(inquiry.history)) inquiry.history = [];
  inquiry.history.unshift(createHistoryEntry(action, actor, note, meta));
}

function canStudentEdit(item) {
  return item.studentEmail === currentUser?.email && ["Pending", "In Progress"].includes(item.status);
}

function canStudentCancel(item) {
  return item.studentEmail === currentUser?.email && !["Resolved", "Cancelled"].includes(item.status);
}

function ensureInquiryShape(inquiry) {
  if (!inquiry.inquiryCode) inquiry.inquiryCode = generateInquiryId();
  if (!inquiry.assignedDepartment) inquiry.assignedDepartment = slugDepartment(inquiry.category);
  if (!("internalNote" in inquiry)) inquiry.internalNote = "";
  if (!("cancelReason" in inquiry)) inquiry.cancelReason = "";
  if (!Array.isArray(inquiry.history)) {
    inquiry.history = [
      createHistoryEntry(
        "Created",
        inquiry.studentName || "System",
        `Inquiry created: ${inquiry.title}`,
        { status: inquiry.status || "Pending" }
      )
    ];
  }
  return inquiry;
}

function initData() {
  if (!localStorage.getItem("unilink_users")) {
    setData("unilink_users", [
      {
        role: "student",
        name: "Emily Carter",
        email: "student@abc.edu",
        password: "123456",
        studentId: "ABC2026001",
        department: "Business Administration",
        year: "Year 2"
      },
      {
        role: "admin",
        name: "Michael Brown",
        email: "admin@abc.edu",
        password: "admin123",
        position: "Student Support Administrator"
      }
    ]);
  } else {
    const users = getData("unilink_users").map(user => ({
      ...user,
      role: normalizeRole(user.role)
    }));
    saveUsers(users);
  }

  if (!localStorage.getItem("unilink_inquiries")) {
    const seeded = [
      {
        id: Date.now() + 1,
        inquiryCode: "INQ-2026-0001",
        studentEmail: "student@abc.edu",
        studentName: "Emily Carter",
        title: "Tuition Payment Verification",
        category: "Tuition & Finance",
        priority: "High",
        message: "I completed my tuition payment yesterday, but the portal still shows pending. Please verify it.",
        attachmentName: "payment-receipt.pdf",
        status: "Pending",
        adminResponse: "",
        assignedDepartment: "Finance Office",
        internalNote: "Check payment gateway reconciliation after 3 PM batch sync.",
        cancelReason: "",
        createdAt: nowString(),
        updatedAt: nowString(),
        history: [
          createHistoryEntry("Created", "Emily Carter", "Inquiry submitted by student.", { status: "Pending" }),
          createHistoryEntry("Assigned", "System", "Assigned to Finance Office.", { department: "Finance Office" })
        ]
      },
      {
        id: Date.now() + 2,
        inquiryCode: "INQ-2026-0002",
        studentEmail: "student@abc.edu",
        studentName: "Emily Carter",
        title: "Transcript Request Process",
        category: "Academic Affairs",
        priority: "Medium",
        message: "I would like to request an official transcript for my internship application. Please advise the process.",
        attachmentName: "",
        status: "In Progress",
        adminResponse: "Your request is being reviewed by the academic office. Further instructions will be sent to your university email.",
        assignedDepartment: "Academic Office",
        internalNote: "Student may need soft copy first for internship deadline.",
        cancelReason: "",
        createdAt: nowString(),
        updatedAt: nowString(),
        history: [
          createHistoryEntry("Created", "Emily Carter", "Inquiry submitted by student.", { status: "Pending" }),
          createHistoryEntry("Assigned", "Michael Brown", "Assigned to Academic Office.", { department: "Academic Office" }),
          createHistoryEntry("Status Changed", "Michael Brown", "Status updated from Pending to In Progress.", { from: "Pending", to: "In Progress" }),
          createHistoryEntry("Response Added", "Michael Brown", "Admin added the first response.")
        ]
      }
    ].map(ensureInquiryShape);

    saveInquiries(seeded);
  } else {
    const inquiries = getInquiries().map(ensureInquiryShape);
    saveInquiries(inquiries);
  }

  if (!localStorage.getItem("unilink_announcements")) {
    setData("unilink_announcements", [
      {
        id: 1,
        title: "Course Registration Week",
        content: "Course registration for the upcoming semester will open from September 2 to September 8.",
        createdAt: nowString()
      },
      {
        id: 2,
        title: "Scholarship Renewal Reminder",
        content: "Students applying for scholarship renewal must submit supporting documents before the deadline.",
        createdAt: nowString()
      }
    ]);
  }

  if (!localStorage.getItem("unilink_faqs")) {
    setData("unilink_faqs", [
      {
        id: 1,
        question: "How can I request my academic transcript?",
        answer: "Submit an inquiry under Academic Affairs and include your full name, student ID, and purpose of request."
      },
      {
        id: 2,
        question: "How do I check my tuition payment status?",
        answer: "Submit a Tuition & Finance inquiry and attach your payment receipt if available."
      },
      {
        id: 3,
        question: "What should I do if I cannot access my student portal?",
        answer: "Use the Forgot Password function first. If the issue continues, submit an IT Support inquiry."
      }
    ]);
  }

  if (!localStorage.getItem("unilink_notifications")) {
    setData("unilink_notifications", [
      {
        id: 1,
        text: "Welcome to UniLink - ABC University portal.",
        createdAt: nowString()
      }
    ]);
  }

  if (!localStorage.getItem("unilink_student_tasks")) {
    setData("unilink_student_tasks", [
      {
        id: 1,
        studentEmail: "student@abc.edu",
        title: "Complete course registration",
        deadline: "Sep 08, 2026",
        status: "Open"
      },
      {
        id: 2,
        studentEmail: "student@abc.edu",
        title: "Upload scholarship renewal documents",
        deadline: "Sep 12, 2026",
        status: "Open"
      },
      {
        id: 3,
        studentEmail: "student@abc.edu",
        title: "Pay remaining tuition balance",
        deadline: "Sep 15, 2026",
        status: "Done"
      }
    ]);
  }

  if (!localStorage.getItem("unilink_deadlines")) {
    setData("unilink_deadlines", [
      { id: 1, title: "Course Registration Deadline", date: "Sep 08, 2026" },
      { id: 2, title: "Scholarship Renewal Submission", date: "Sep 12, 2026" },
      { id: 3, title: "Tuition Final Payment Deadline", date: "Sep 15, 2026" }
    ]);
  }

  if (!localStorage.getItem("unilink_dark_mode")) {
    localStorage.setItem("unilink_dark_mode", "false");
  }
}

function getUsers() {
  return getData("unilink_users").map(user => ({
    ...user,
    role: normalizeRole(user.role)
  }));
}
function saveUsers(data) { setData("unilink_users", data); }
function getInquiries() { return getData("unilink_inquiries"); }
function saveInquiries(data) { setData("unilink_inquiries", data); }
function getAnnouncements() { return getData("unilink_announcements"); }
function saveAnnouncements(data) { setData("unilink_announcements", data); }
function getFaqs() { return getData("unilink_faqs"); }
function saveFaqs(data) { setData("unilink_faqs", data); }
function getNotifications() { return getData("unilink_notifications"); }
function saveNotifications(data) { setData("unilink_notifications", data); }

function addNotification(text) {
  const notifications = getNotifications();
  notifications.unshift({
    id: Date.now(),
    text,
    createdAt: nowString()
  });
  saveNotifications(notifications);
  renderNotifications();
}

/* auth */
function switchAuthTab(tab, clickedBtn) {
  document.querySelectorAll(".auth-tab").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".auth-panel").forEach(panel => panel.classList.add("hidden"));
  clickedBtn.classList.add("active");

  if (tab === "login") document.getElementById("loginPanel").classList.remove("hidden");
  if (tab === "register") document.getElementById("registerPanel").classList.remove("hidden");
  if (tab === "forgot") document.getElementById("forgotPanel").classList.remove("hidden");
}

function createDefaultTasksForStudent(email) {
  const tasks = getData("unilink_student_tasks");

  const existed = tasks.some(t => t.studentEmail === email);
  if (existed) return;

  tasks.push(
    {
      id: Date.now() + 1,
      studentEmail: email,
      title: "Complete course registration",
      deadline: "Sep 08, 2026",
      status: "Open"
    },
    {
      id: Date.now() + 2,
      studentEmail: email,
      title: "Upload scholarship renewal documents",
      deadline: "Sep 12, 2026",
      status: "Open"
    },
    {
      id: Date.now() + 3,
      studentEmail: email,
      title: "Pay remaining tuition balance",
      deadline: "Sep 15, 2026",
      status: "Done"
    }
  );

  setData("unilink_student_tasks", tasks);
}

function login() {
  const role = normalizeRole(document.getElementById("loginRole")?.value);
  const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
  const password = document.getElementById("loginPassword")?.value.trim();

  const authPage = document.getElementById("authPage");
  const appPage = document.getElementById("appPage");

  if (!authPage || !appPage) {
    alert("Thiếu #authPage hoặc #appPage trong HTML.");
    console.error("Missing #authPage or #appPage");
    return;
  }

  if (!role || !email || !password) {
    alert("Please complete role, email, and password.");
    return;
  }

  const users = getUsers();

  const user = users.find(u => {
    const userRole = normalizeRole(u.role);
    const userEmail = String(u.email || "").trim().toLowerCase();
    const userPassword = String(u.password || "");
    return userRole === role && userEmail === email && userPassword === password;
  });

  if (!user) {
    const sameEmail = users.find(u => String(u.email || "").trim().toLowerCase() === email);

    if (sameEmail && normalizeRole(sameEmail.role) !== role) {
      alert("Sai Role. Hãy chọn đúng vai trò của tài khoản.");
      return;
    }

    alert("Invalid login credentials.");
    return;
  }

  currentUser = {
    ...user,
    role: normalizeRole(user.role)
  };

  localStorage.setItem("unilink_current_user", JSON.stringify(currentUser));

  if (currentUser.role === "student") {
    createDefaultTasksForStudent(currentUser.email);
  }

  authPage.classList.add("hidden");
  appPage.classList.remove("hidden");
  setupPortal();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("unilink_current_user");

  const appPage = document.getElementById("appPage");
  const authPage = document.getElementById("authPage");

  if (appPage) appPage.classList.add("hidden");
  if (authPage) authPage.classList.remove("hidden");
}

function registerStudent() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const studentId = document.getElementById("registerStudentId").value.trim();
  const department = document.getElementById("registerDepartment").value.trim();
  const year = document.getElementById("registerYear").value;
  const password = document.getElementById("registerPassword").value.trim();

  if (!name || !email || !studentId || !department || !password) {
    alert("Please complete all registration fields.");
    return;
  }

  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === email);

  if (exists) {
    alert("This email is already registered.");
    return;
  }

  users.push({
    role: "student",
    name,
    email,
    password,
    studentId,
    department,
    year
  });

  saveUsers(users);
  addNotification(`New student account registered: ${name}`);
  alert("Student account created successfully. You can now log in.");

  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerStudentId").value = "";
  document.getElementById("registerDepartment").value = "";
  document.getElementById("registerPassword").value = "";

  const loginTab = document.querySelectorAll(".auth-tab")[0];
  switchAuthTab("login", loginTab);
}

function forgotPassword() {
  const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  if (!user) {
    alert("No account found with that email.");
    return;
  }

  alert(`Demo mode: password reset instruction has been sent to ${email}.`);
  addNotification(`Password reset request submitted for ${email}`);
  document.getElementById("forgotEmail").value = "";
}

/* portal */
function setupPortal() {
  if (!currentUser) return;

  currentUser.role = normalizeRole(currentUser.role);

  const userLabel = document.getElementById("userLabel");
  if (userLabel) {
    userLabel.innerText = `${currentUser.name} • ${currentUser.role.toUpperCase()}`;
  }

  document.querySelectorAll(".page-section").forEach(section => section.classList.add("hidden"));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

  if (currentUser.role === "student") {
    document.getElementById("studentNav")?.classList.remove("hidden");
    document.getElementById("adminNav")?.classList.add("hidden");

    document.getElementById("studentDashboard")?.classList.remove("hidden");
    document.querySelector("#studentNav .nav-link")?.classList.add("active");

    renderSuggestedQuestions();
    renderStudentDashboard();
    renderStudentDashboardAnnouncements();
    renderDeadlines();
    renderStudentInquiries();
    renderStudentTasks();
    renderStudentAnnouncementsPage();
    renderFaqList();
    renderStudentProfile();
  } else if (currentUser.role === "admin") {
    document.getElementById("studentNav")?.classList.add("hidden");
    document.getElementById("adminNav")?.classList.remove("hidden");

    document.getElementById("adminDashboard")?.classList.remove("hidden");
    document.querySelector("#adminNav .nav-link")?.classList.add("active");

    renderAdminDashboard();
    renderAdminInquiries();
    renderStudentAccounts();
    renderAnnouncementList();
    renderFaqAdminList();
  } else {
    alert("Unknown user role.");
    console.error("Unknown role:", currentUser.role);
    return;
  }

  renderNotifications();
}

function showSection(sectionId, btn) {
  document.querySelectorAll(".page-section").forEach(section => section.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");

  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
  btn.classList.add("active");

  if (sectionId === "studentDashboard") {
    renderStudentDashboard();
    renderStudentDashboardAnnouncements();
    renderDeadlines();
  }
  if (sectionId === "studentInquiries") renderStudentInquiries();
  if (sectionId === "studentTasks") renderStudentTasks();
  if (sectionId === "studentAnnouncements") renderStudentAnnouncementsPage();
  if (sectionId === "studentFaq") renderFaqList();
  if (sectionId === "studentProfile") renderStudentProfile();

  if (sectionId === "adminDashboard") renderAdminDashboard();
  if (sectionId === "adminInquiries") renderAdminInquiries();
  if (sectionId === "adminStudents") renderStudentAccounts();
  if (sectionId === "adminAnnouncements") renderAnnouncementList();
  if (sectionId === "adminFaq") renderFaqAdminList();
}

/* student */
function renderSuggestedQuestions() {
  const wrap = document.getElementById("suggestedQuestionWrap");
  if (!wrap) return;
  wrap.innerHTML = "";

  suggestedQuestions.forEach(question => {
    const tag = document.createElement("button");
    tag.className = "tag";
    tag.innerText = question;
    tag.onclick = () => {
      document.getElementById("inquiryTitle").value = question;
      document.getElementById("inquiryMessage").value = question;
    };
    wrap.appendChild(tag);
  });
}

function submitInquiry() {
  const title = document.getElementById("inquiryTitle").value.trim();
  const category = document.getElementById("inquiryCategory").value;
  const priority = document.getElementById("inquiryPriority").value;
  const message = document.getElementById("inquiryMessage").value.trim();
  const fileInput = document.getElementById("inquiryAttachment");
  const attachmentName = fileInput?.files?.[0] ? fileInput.files[0].name : "";

  if (!title || !message) {
    alert("Please complete the title and message.");
    return;
  }

  const newInquiry = ensureInquiryShape({
    id: Date.now(),
    inquiryCode: generateInquiryId(),
    studentEmail: currentUser.email,
    studentName: currentUser.name,
    title,
    category,
    priority,
    message,
    attachmentName,
    status: "Pending",
    adminResponse: "",
    assignedDepartment: slugDepartment(category),
    internalNote: "",
    cancelReason: "",
    createdAt: nowString(),
    updatedAt: nowString(),
    history: []
  });

  pushHistory(newInquiry, "Created", currentUser.name, "Student submitted a new inquiry.", {
    status: "Pending"
  });
  pushHistory(newInquiry, "Assigned", "System", `Auto-assigned to ${newInquiry.assignedDepartment}.`, {
    department: newInquiry.assignedDepartment
  });

  const inquiries = getInquiries();
  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);
  addNotification(`New inquiry submitted by ${currentUser.name}: ${title} (${newInquiry.inquiryCode})`);

  document.getElementById("inquiryTitle").value = "";
  document.getElementById("inquiryMessage").value = "";
  document.getElementById("inquiryPriority").value = "Medium";
  document.getElementById("inquiryAttachment").value = "";

  alert(`Inquiry submitted successfully. Your Inquiry ID is ${newInquiry.inquiryCode}.`);
  renderStudentDashboard();
  renderStudentInquiries();
}

function renderStudentDashboard() {
  const inquiries = getInquiries().filter(i => i.studentEmail === currentUser.email);
  const tasks = getData("unilink_student_tasks").filter(t => t.studentEmail === currentUser.email);

  document.getElementById("studentTotalCount").innerText = inquiries.length;
  document.getElementById("studentOpenCount").innerText = inquiries.filter(i => !["Resolved", "Cancelled"].includes(i.status)).length;
  document.getElementById("studentResolvedCount").innerText = inquiries.filter(i => i.status === "Resolved").length;
  document.getElementById("studentTaskOpenCount").innerText = tasks.filter(t => t.status === "Open").length;
}

function renderStudentDashboardAnnouncements() {
  const list = document.getElementById("studentDashboardAnnouncements");
  const announcements = getAnnouncements().slice().reverse().slice(0, 3);

  if (!announcements.length) {
    list.innerHTML = `<div class="empty-state">No announcements available.</div>`;
    return;
  }

  list.innerHTML = announcements.map(item => `
    <div class="announcement-item">
      <div class="item-title">${escapeHtml(item.title)}</div>
      <div class="item-meta">Published: ${escapeHtml(item.createdAt)}</div>
      <div style="margin-top:10px; line-height:1.7;">${formatText(item.content)}</div>
    </div>
  `).join("");
}

function renderDeadlines() {
  const list = document.getElementById("studentDeadlineList");
  const deadlines = getData("unilink_deadlines");

  if (!deadlines.length) {
    list.innerHTML = `<div class="empty-state">No upcoming deadlines.</div>`;
    return;
  }

  list.innerHTML = deadlines.map(item => `
    <div class="deadline-item">
      <div class="item-title">${escapeHtml(item.title)}</div>
      <div class="item-meta">Deadline: ${escapeHtml(item.date)}</div>
    </div>
  `).join("");
}

function renderStudentInquiries() {
  const search = (document.getElementById("studentSearch")?.value || "").toLowerCase();
  const statusFilter = document.getElementById("studentStatusFilter")?.value || "all";
  const priorityFilter = document.getElementById("studentPriorityFilter")?.value || "all";

  let inquiries = getInquiries().map(ensureInquiryShape).filter(i => i.studentEmail === currentUser.email);

  if (statusFilter !== "all") inquiries = inquiries.filter(i => i.status === statusFilter);
  if (priorityFilter !== "all") inquiries = inquiries.filter(i => i.priority === priorityFilter);

  if (search) {
    inquiries = inquiries.filter(i =>
      i.title.toLowerCase().includes(search) ||
      i.message.toLowerCase().includes(search) ||
      i.category.toLowerCase().includes(search) ||
      (i.inquiryCode || "").toLowerCase().includes(search)
    );
  }

  const list = document.getElementById("studentInquiryList");

  if (!inquiries.length) {
    list.innerHTML = `<div class="empty-state">No inquiries found.</div>`;
    return;
  }

  list.innerHTML = inquiries.map(item => {
    const latestHistory = item.history?.[0];
    return `
      <div class="item-card inquiry-card inquiry-card-student">
        <div class="item-head">
          <div>
            <div class="item-title">${escapeHtml(item.title)}</div>
            <div class="item-meta">
              <strong>${escapeHtml(item.inquiryCode)}</strong> • ${escapeHtml(item.category)} • ${escapeHtml(item.assignedDepartment || "Unassigned")}<br>
              Submitted: ${escapeHtml(item.createdAt)} • Last Updated: ${escapeHtml(item.updatedAt)}
            </div>
          </div>
          <div class="badge-row">
            <span class="priority-badge ${priorityClass(item.priority)}">${escapeHtml(item.priority)}</span>
            <span class="status-badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
          </div>
        </div>

        <div style="line-height:1.7; margin:10px 0 0;">${formatText(item.message)}</div>

        <div class="inquiry-info-grid" style="margin-top:14px; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px;">
          <div class="mini-info-box"><strong>Inquiry ID</strong><br>${escapeHtml(item.inquiryCode)}</div>
          <div class="mini-info-box"><strong>Assigned Department</strong><br>${escapeHtml(item.assignedDepartment || "Pending assignment")}</div>
          <div class="mini-info-box"><strong>Attachment</strong><br>${escapeHtml(item.attachmentName || "No attachment")}</div>
          <div class="mini-info-box"><strong>Latest Activity</strong><br>${escapeHtml(latestHistory?.action || "Created")}</div>
        </div>

        ${item.adminResponse ? `
          <div class="response-box">
            <strong>Latest Admin Response:</strong><br>
            ${formatText(item.adminResponse)}
          </div>
        ` : ""}

        ${item.status === "Cancelled" && item.cancelReason ? `
          <div class="response-box" style="border-left-color:#ef4444; background:#fff1f2;">
            <strong>Cancellation Reason:</strong><br>
            ${formatText(item.cancelReason)}
          </div>
        ` : ""}

        <div class="action-row" style="margin-top:14px; display:flex; flex-wrap:wrap; gap:10px;">
          <button class="small-btn" onclick="openStudentInquiryDetails(${item.id})">View Details</button>
          ${canStudentEdit(item) ? `<button class="small-btn success" onclick="openEditInquiry(${item.id})">Edit Inquiry</button>` : ""}
          ${canStudentCancel(item) ? `<button class="small-btn danger" onclick="cancelInquiry(${item.id})">Cancel Inquiry</button>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

function openStudentInquiryDetails(id) {
  viewingInquiryId = id;
  const inquiry = getInquiries().find(item => item.id === id);
  if (!inquiry) return;

  const modal = document.getElementById("studentInquiryDetailModal");
  const body = document.getElementById("studentInquiryDetailBody");
  if (!modal || !body) {
    alert("Please add #studentInquiryDetailModal and #studentInquiryDetailBody to use the detail modal.");
    return;
  }

  const historyHtml = (inquiry.history || []).map(entry => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="item-title" style="font-size:14px;">${escapeHtml(entry.action)}</div>
        <div class="item-meta">${escapeHtml(entry.at)} • ${escapeHtml(entry.actor)}</div>
        <div style="margin-top:6px; line-height:1.7;">${formatText(entry.note || "")}</div>
      </div>
    </div>
  `).join("") || `<div class="empty-state">No timeline available.</div>`;

  body.innerHTML = `
    <div class="detail-hero" style="display:grid; gap:14px;">
      <div class="item-head">
        <div>
          <div class="item-title">${escapeHtml(inquiry.title)}</div>
          <div class="item-meta">${escapeHtml(inquiry.inquiryCode)} • ${escapeHtml(inquiry.category)}</div>
        </div>
        <div class="badge-row">
          <span class="priority-badge ${priorityClass(inquiry.priority)}">${escapeHtml(inquiry.priority)}</span>
          <span class="status-badge ${statusClass(inquiry.status)}">${escapeHtml(inquiry.status)}</span>
        </div>
      </div>

      <div class="inquiry-info-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
        <div class="mini-info-box"><strong>Submitted</strong><br>${escapeHtml(inquiry.createdAt)}</div>
        <div class="mini-info-box"><strong>Last Updated</strong><br>${escapeHtml(inquiry.updatedAt)}</div>
        <div class="mini-info-box"><strong>Assigned Department</strong><br>${escapeHtml(inquiry.assignedDepartment || "Pending assignment")}</div>
        <div class="mini-info-box"><strong>Attachment</strong><br>${escapeHtml(inquiry.attachmentName || "No attachment")}</div>
      </div>

      <div class="detail-box">
        <div class="item-title" style="font-size:15px;">Student Message</div>
        <div style="margin-top:8px; line-height:1.8;">${formatText(inquiry.message)}</div>
      </div>

      ${inquiry.adminResponse ? `
        <div class="response-box">
          <strong>Admin Response</strong><br>
          ${formatText(inquiry.adminResponse)}
        </div>
      ` : ""}

      <div class="detail-box">
        <div class="item-title" style="font-size:15px; margin-bottom:12px;">Processing Timeline</div>
        <div class="timeline-wrap">${historyHtml}</div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeStudentInquiryDetails() {
  viewingInquiryId = null;
  const modal = document.getElementById("studentInquiryDetailModal");
  if (modal) modal.classList.add("hidden");
}

function openEditInquiry(id) {
  const inquiry = getInquiries().find(item => item.id === id);
  if (!inquiry) return;
  if (!canStudentEdit(inquiry)) {
    alert("Only Pending or In Progress inquiries can be edited.");
    return;
  }

  const modal = document.getElementById("editInquiryModal");
  if (!modal) {
    alert("Please add #editInquiryModal to use the edit inquiry feature.");
    return;
  }

  editingInquiryId = id;
  document.getElementById("editInquiryTitle").value = inquiry.title;
  document.getElementById("editInquiryCategory").value = inquiry.category;
  document.getElementById("editInquiryPriority").value = inquiry.priority;
  document.getElementById("editInquiryMessage").value = inquiry.message;
  modal.classList.remove("hidden");
}

function closeEditInquiryModal() {
  editingInquiryId = null;
  const modal = document.getElementById("editInquiryModal");
  if (modal) modal.classList.add("hidden");
}

function updateInquiryByStudent() {
  if (!editingInquiryId) return;

  const title = document.getElementById("editInquiryTitle").value.trim();
  const category = document.getElementById("editInquiryCategory").value;
  const priority = document.getElementById("editInquiryPriority").value;
  const message = document.getElementById("editInquiryMessage").value.trim();

  if (!title || !message) {
    alert("Please complete the title and message.");
    return;
  }

  const inquiries = getInquiries();
  const index = inquiries.findIndex(item => item.id === editingInquiryId);
  if (index === -1) return;

  const inquiry = inquiries[index];
  if (!canStudentEdit(inquiry)) {
    alert("This inquiry can no longer be edited.");
    return;
  }

  const oldSnapshot = `${inquiry.title} / ${inquiry.category} / ${inquiry.priority}`;

  inquiry.title = title;
  inquiry.category = category;
  inquiry.priority = priority;
  inquiry.message = message;
  inquiry.assignedDepartment = slugDepartment(category);
  inquiry.updatedAt = nowString();
  pushHistory(
    inquiry,
    "Edited",
    currentUser.name,
    `Student updated inquiry details. Previous summary: ${oldSnapshot}`,
    { category, priority }
  );
  pushHistory(
    inquiry,
    "Reassigned",
    "System",
    `Department updated to ${inquiry.assignedDepartment} based on category.`,
    { department: inquiry.assignedDepartment }
  );

  saveInquiries(inquiries);
  addNotification(`Inquiry updated by student: ${inquiry.title} (${inquiry.inquiryCode})`);
  alert("Inquiry updated successfully.");
  closeEditInquiryModal();
  renderStudentInquiries();
  renderAdminInquiries();
}

function cancelInquiry(id) {
  const inquiries = getInquiries();
  const index = inquiries.findIndex(item => item.id === id);
  if (index === -1) return;

  const inquiry = inquiries[index];
  if (!canStudentCancel(inquiry)) {
    alert("This inquiry cannot be cancelled.");
    return;
  }

  const reason = prompt("Please enter a cancellation reason:", "No longer needed.");
  if (reason === null) return;

  inquiry.status = "Cancelled";
  inquiry.cancelReason = reason.trim() || "No reason provided.";
  inquiry.updatedAt = nowString();
  pushHistory(inquiry, "Cancelled", currentUser.name, `Student cancelled the inquiry. Reason: ${inquiry.cancelReason}`, {
    status: "Cancelled"
  });

  saveInquiries(inquiries);
  addNotification(`Inquiry cancelled by ${currentUser.name}: ${inquiry.title} (${inquiry.inquiryCode})`);
  alert("Inquiry cancelled successfully.");
  renderStudentDashboard();
  renderStudentInquiries();
  renderAdminDashboard();
  renderAdminInquiries();
}

function renderStudentTasks() {
  const tasks = getData("unilink_student_tasks").filter(t => t.studentEmail === currentUser.email);

  const list = document.getElementById("studentTaskList");
  const summary = document.getElementById("studentTaskSummary");

  if (!tasks.length) {
    list.innerHTML = `<div class="empty-state">No tasks available.</div>`;
    summary.innerHTML = "";
    return;
  }

  list.innerHTML = tasks.map(task => `
    <div class="task-item">
      <div class="item-head">
        <div>
          <div class="item-title">${escapeHtml(task.title)}</div>
          <div class="item-meta">Deadline: ${escapeHtml(task.deadline)}</div>
        </div>
        <span class="task-status-badge ${task.status === "Done" ? "task-done" : "task-open"}">
          ${escapeHtml(task.status)}
        </span>
      </div>

      <div class="progress-bar">
        <div class="progress-fill ${task.status === "Done" ? "done" : ""}"></div>
      </div>

      <div class="action-row">
        ${task.status === "Open"
          ? `<button class="small-btn success" onclick="markStudentTaskDone(${task.id})">Mark Done</button>`
          : `<button class="small-btn" onclick="markStudentTaskOpen(${task.id})">Reopen</button>`}
      </div>
    </div>
  `).join("");

  const total = tasks.length;
  const done = tasks.filter(t => t.status === "Done").length;
  const open = tasks.filter(t => t.status === "Open").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  summary.innerHTML = `
    <div><strong>Total Tasks:</strong> ${total}</div>
    <div><strong>Completed:</strong> ${done}</div>
    <div><strong>Pending:</strong> ${open}</div>
    <div><strong>Completion Rate:</strong> ${percent}%</div>
    <div class="big-progress">
      <div class="big-progress-fill" style="width:${percent}%"></div>
    </div>
  `;
}

function markStudentTaskDone(id) {
  const tasks = getData("unilink_student_tasks");
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  tasks[index].status = "Done";
  setData("unilink_student_tasks", tasks);
  renderStudentTasks();
  renderStudentDashboard();
}

function markStudentTaskOpen(id) {
  const tasks = getData("unilink_student_tasks");
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  tasks[index].status = "Open";
  setData("unilink_student_tasks", tasks);
  renderStudentTasks();
  renderStudentDashboard();
}

function renderStudentAnnouncementsPage() {
  const list = document.getElementById("studentAnnouncementList");
  const announcements = getAnnouncements().slice().reverse();

  if (!announcements.length) {
    list.innerHTML = `<div class="empty-state">No announcements available.</div>`;
    return;
  }

  list.innerHTML = announcements.map(item => `
    <div class="announcement-item">
      <div class="item-title">${escapeHtml(item.title)}</div>
      <div class="item-meta">Published: ${escapeHtml(item.createdAt)}</div>
      <div style="margin-top:10px; line-height:1.7;">${formatText(item.content)}</div>
    </div>
  `).join("");
}

function renderFaqList() {
  const list = document.getElementById("faqList");
  const faqs = getFaqs();

  if (!faqs.length) {
    list.innerHTML = `<div class="empty-state">No FAQ items available.</div>`;
    return;
  }

  list.innerHTML = faqs.map(item => `
    <div class="faq-item">
      <div class="item-title">${escapeHtml(item.question)}</div>
      <div style="line-height:1.7;">${formatText(item.answer)}</div>
    </div>
  `).join("");
}

function renderStudentProfile() {
  document.getElementById("studentProfileInfo").innerHTML = `
    <div><strong>Full Name:</strong> ${escapeHtml(currentUser.name)}</div>
    <div><strong>Email:</strong> ${escapeHtml(currentUser.email)}</div>
    <div><strong>Student ID:</strong> ${escapeHtml(currentUser.studentId || "-")}</div>
    <div><strong>Department:</strong> ${escapeHtml(currentUser.department || "-")}</div>
    <div><strong>Year Level:</strong> ${escapeHtml(currentUser.year || "-")}</div>
  `;
}

/* admin */
function renderAdminDashboard() {
  const inquiries = getInquiries().map(ensureInquiryShape);

  document.getElementById("adminTotalCount").innerText = inquiries.length;
  document.getElementById("adminPendingCount").innerText = inquiries.filter(i => i.status === "Pending").length;
  document.getElementById("adminProgressCount").innerText = inquiries.filter(i => i.status === "In Progress").length;
  document.getElementById("adminResolvedCount").innerText = inquiries.filter(i => i.status === "Resolved").length;

  const list = document.getElementById("adminRecentInquiries");
  const recent = inquiries.slice(0, 5);

  if (!recent.length) {
    list.innerHTML = `<div class="empty-state">No recent inquiries found.</div>`;
    return;
  }

  list.innerHTML = recent.map(item => `
    <div class="item-card">
      <div class="item-head">
        <div>
          <div class="item-title">${escapeHtml(item.title)}</div>
          <div class="item-meta">${escapeHtml(item.inquiryCode)} • ${escapeHtml(item.studentName)} • ${escapeHtml(item.category)} • ${escapeHtml(item.createdAt)}</div>
        </div>
        <div class="badge-row">
          <span class="priority-badge ${priorityClass(item.priority)}">${escapeHtml(item.priority)}</span>
          <span class="status-badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
        </div>
      </div>
      <div>${formatText(item.message)}</div>
    </div>
  `).join("");
}

function renderAdminInquiries() {
  const search = (document.getElementById("adminSearch")?.value || "").toLowerCase();
  const statusFilter = document.getElementById("adminStatusFilter")?.value || "all";
  const priorityFilter = document.getElementById("adminPriorityFilter")?.value || "all";

  let inquiries = getInquiries().map(ensureInquiryShape);

  if (statusFilter !== "all") inquiries = inquiries.filter(i => i.status === statusFilter);
  if (priorityFilter !== "all") inquiries = inquiries.filter(i => i.priority === priorityFilter);

  if (search) {
    inquiries = inquiries.filter(i =>
      i.studentName.toLowerCase().includes(search) ||
      i.title.toLowerCase().includes(search) ||
      i.message.toLowerCase().includes(search) ||
      i.category.toLowerCase().includes(search) ||
      (i.inquiryCode || "").toLowerCase().includes(search) ||
      (i.assignedDepartment || "").toLowerCase().includes(search)
    );
  }

  const list = document.getElementById("adminInquiryList");

  if (!inquiries.length) {
    list.innerHTML = `<div class="empty-state">No inquiries found.</div>`;
    return;
  }

  list.innerHTML = inquiries.map(item => {
    const timelinePreview = (item.history || []).slice(0, 4).map(entry => `
      <div class="timeline-item compact">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="item-title" style="font-size:13px;">${escapeHtml(entry.action)}</div>
          <div class="item-meta">${escapeHtml(entry.at)} • ${escapeHtml(entry.actor)}</div>
          <div style="margin-top:4px; line-height:1.65;">${formatText(entry.note || "")}</div>
        </div>
      </div>
    `).join("");

    return `
      <div class="item-card inquiry-card inquiry-card-admin">
        <div class="item-head">
          <div>
            <div class="item-title">${escapeHtml(item.title)}</div>
            <div class="item-meta">
              <strong>${escapeHtml(item.inquiryCode)}</strong> • ${escapeHtml(item.studentName)} (${escapeHtml(item.studentEmail)})<br>
              ${escapeHtml(item.category)} • Submitted: ${escapeHtml(item.createdAt)} • Last Updated: ${escapeHtml(item.updatedAt)}
            </div>
          </div>
          <div class="badge-row">
            <span class="priority-badge ${priorityClass(item.priority)}">${escapeHtml(item.priority)}</span>
            <span class="status-badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
          </div>
        </div>

        <div style="line-height:1.7; margin-top:10px;">${formatText(item.message)}</div>
        ${item.attachmentName ? `<div class="item-meta" style="margin-top:8px;"><strong>Attachment:</strong> ${escapeHtml(item.attachmentName)}</div>` : ""}

        <div class="inquiry-info-grid" style="margin-top:14px; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
          <div class="mini-info-box"><strong>Inquiry ID</strong><br>${escapeHtml(item.inquiryCode)}</div>
          <div class="mini-info-box"><strong>Assigned Department</strong><br>${escapeHtml(item.assignedDepartment || "Unassigned")}</div>
          <div class="mini-info-box"><strong>Current Status</strong><br>${escapeHtml(item.status)}</div>
          <div class="mini-info-box"><strong>Student</strong><br>${escapeHtml(item.studentName)}</div>
        </div>

        <div class="admin-actions" style="margin-top:16px; display:grid; gap:14px;">
          <div class="form-group">
            <label>Status</label>
            <select id="status-${item.id}">
              <option value="Pending" ${item.status === "Pending" ? "selected" : ""}>Pending</option>
              <option value="In Progress" ${item.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option value="Resolved" ${item.status === "Resolved" ? "selected" : ""}>Resolved</option>
              <option value="Cancelled" ${item.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </div>

          <div class="form-group">
            <label>Assigned Department</label>
            <select id="department-${item.id}">
              ${[
                "Student Support Center",
                "Academic Office",
                "Finance Office",
                "IT Helpdesk",
                "Scholarship Office",
                "Student Housing",
                "Career Services"
              ].map(dept => `<option value="${dept}" ${item.assignedDepartment === dept ? "selected" : ""}>${dept}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>Admin Response</label>
            <textarea id="response-${item.id}" placeholder="Write your reply...">${escapeHtml(item.adminResponse || "")}</textarea>
          </div>

          <div class="form-group">
            <label>Internal Note (Admin Only)</label>
            <textarea id="note-${item.id}" placeholder="Internal handling notes, escalation notes, checklist...">${escapeHtml(item.internalNote || "")}</textarea>
          </div>

          <button class="btn btn-primary" onclick="saveAdminReply(${item.id})">Save Update</button>
        </div>

        <div class="detail-box" style="margin-top:18px;">
          <div class="item-title" style="font-size:15px; margin-bottom:12px;">Processing Timeline</div>
          <div class="timeline-wrap">${timelinePreview || `<div class="empty-state">No timeline available.</div>`}</div>
        </div>
      </div>
    `;
  }).join("");
}

function saveAdminReply(id) {
  const inquiries = getInquiries();
  const index = inquiries.findIndex(i => i.id === id);
  if (index === -1) return;

  const inquiry = inquiries[index];
  const oldStatus = inquiry.status;
  const oldDepartment = inquiry.assignedDepartment || "";
  const oldResponse = inquiry.adminResponse || "";
  const oldInternalNote = inquiry.internalNote || "";

  const newStatus = document.getElementById(`status-${id}`).value;
  const newDepartment = document.getElementById(`department-${id}`).value;
  const newResponse = document.getElementById(`response-${id}`).value.trim();
  const newInternalNote = document.getElementById(`note-${id}`).value.trim();

  inquiry.status = newStatus;
  inquiry.assignedDepartment = newDepartment;
  inquiry.adminResponse = newResponse;
  inquiry.internalNote = newInternalNote;
  inquiry.updatedAt = nowString();

  if (oldStatus !== newStatus) {
    pushHistory(inquiry, "Status Changed", currentUser.name, `Status updated from ${oldStatus} to ${newStatus}.`, {
      from: oldStatus,
      to: newStatus
    });
    addNotification(`Inquiry "${inquiry.title}" updated to ${newStatus}`);
  }

  if (oldDepartment !== newDepartment) {
    pushHistory(inquiry, "Reassigned", currentUser.name, `Assigned department changed from ${oldDepartment || "Unassigned"} to ${newDepartment}.`, {
      from: oldDepartment,
      to: newDepartment
    });
  }

  if (oldResponse !== newResponse) {
    pushHistory(inquiry, "Response Added", currentUser.name, newResponse ? "Admin response updated." : "Admin response cleared.");
  }

  if (oldInternalNote !== newInternalNote) {
    pushHistory(inquiry, "Internal Note Updated", currentUser.name, newInternalNote ? "Internal note updated for internal handling." : "Internal note cleared.");
  }

  saveInquiries(inquiries);
  alert("Inquiry updated successfully.");
  renderAdminDashboard();
  renderAdminInquiries();
  renderStudentDashboard();
  renderStudentInquiries();
}

function adminCreateStudent() {
  const name = document.getElementById("adminCreateName").value.trim();
  const email = document.getElementById("adminCreateEmail").value.trim().toLowerCase();
  const studentId = document.getElementById("adminCreateStudentId").value.trim();
  const department = document.getElementById("adminCreateDepartment").value.trim();
  const year = document.getElementById("adminCreateYear").value;
  const password = document.getElementById("adminCreatePassword").value.trim();

  if (!name || !email || !studentId || !department || !password) {
    alert("Please complete all student account fields.");
    return;
  }

  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === email);

  if (exists) {
    alert("This email is already registered.");
    return;
  }

  users.push({
    role: "student",
    name,
    email,
    password,
    studentId,
    department,
    year
  });

  saveUsers(users);
  addNotification(`Admin created a student account for ${name}`);

  document.getElementById("adminCreateName").value = "";
  document.getElementById("adminCreateEmail").value = "";
  document.getElementById("adminCreateStudentId").value = "";
  document.getElementById("adminCreateDepartment").value = "";
  document.getElementById("adminCreatePassword").value = "";

  alert("Student account created successfully.");
  renderStudentAccounts();
}

function renderStudentAccounts() {
  const students = getUsers().filter(u => u.role === "student");
  const list = document.getElementById("studentAccountList");

  if (!students.length) {
    list.innerHTML = `<div class="empty-state">No student accounts available.</div>`;
    return;
  }

  list.innerHTML = students.map(student => `
    <div class="account-item">
      <div class="item-title">${escapeHtml(student.name)}</div>
      <div class="item-meta">
        ${escapeHtml(student.email)}<br>
        Student ID: ${escapeHtml(student.studentId)}<br>
        Department: ${escapeHtml(student.department)}<br>
        Year Level: ${escapeHtml(student.year)}
      </div>
      <div class="action-row">
        <button class="small-btn danger" onclick="deleteStudent('${escapeHtml(student.email)}')">Delete</button>
      </div>
    </div>
  `).join("");
}

function deleteStudent(email) {
  if (email === currentUser.email) {
    alert("You cannot delete the currently logged-in account.");
    return;
  }

  if (!confirm("Are you sure you want to delete this student account?")) return;

  let users = getUsers();
  users = users.filter(u => u.email !== email);
  saveUsers(users);

  addNotification(`Student account deleted: ${email}`);
  renderStudentAccounts();
}

function addAnnouncement() {
  const title = document.getElementById("announcementTitle").value.trim();
  const content = document.getElementById("announcementContent").value.trim();

  if (!title || !content) {
    alert("Please complete announcement title and content.");
    return;
  }

  const announcements = getAnnouncements();
  announcements.push({
    id: Date.now(),
    title,
    content,
    createdAt: nowString()
  });
  saveAnnouncements(announcements);

  document.getElementById("announcementTitle").value = "";
  document.getElementById("announcementContent").value = "";

  addNotification(`New announcement published: ${title}`);
  alert("Announcement published successfully.");

  renderAnnouncementList();
  renderStudentDashboardAnnouncements();
  renderStudentAnnouncementsPage();
}

function renderAnnouncementList() {
  const announcements = getAnnouncements().slice().reverse();
  const list = document.getElementById("announcementList");

  if (!announcements.length) {
    list.innerHTML = `<div class="empty-state">No announcements published.</div>`;
    return;
  }

  list.innerHTML = announcements.map(item => `
    <div class="announcement-item">
      <div class="item-title">${escapeHtml(item.title)}</div>
      <div class="item-meta">Published: ${escapeHtml(item.createdAt)}</div>
      <div style="margin-top:10px; line-height:1.7;">${formatText(item.content)}</div>
    </div>
  `).join("");
}

function addFaq() {
  const question = document.getElementById("faqQuestion").value.trim();
  const answer = document.getElementById("faqAnswer").value.trim();

  if (!question || !answer) {
    alert("Please complete both FAQ fields.");
    return;
  }

  const faqs = getFaqs();
  faqs.push({
    id: Date.now(),
    question,
    answer
  });
  saveFaqs(faqs);

  document.getElementById("faqQuestion").value = "";
  document.getElementById("faqAnswer").value = "";

  addNotification(`New FAQ added: ${question}`);
  alert("FAQ added successfully.");
  renderFaqAdminList();
  renderFaqList();
}

function renderFaqAdminList() {
  const faqs = getFaqs();
  const list = document.getElementById("adminFaqList");

  if (!faqs.length) {
    list.innerHTML = `<div class="empty-state">No FAQ items available.</div>`;
    return;
  }

  list.innerHTML = faqs.map(item => `
    <div class="faq-item">
      <div class="item-title">${escapeHtml(item.question)}</div>
      <div style="line-height:1.7;">${formatText(item.answer)}</div>
      <div class="action-row">
        <button class="small-btn danger" onclick="deleteFaq(${item.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function deleteFaq(id) {
  let faqs = getFaqs();
  faqs = faqs.filter(f => f.id !== id);
  saveFaqs(faqs);
  addNotification("An FAQ item was deleted.");
  renderFaqAdminList();
  renderFaqList();
}

/* ui */
function toggleNotifications() {
  document.getElementById("notificationPanel").classList.toggle("hidden");
}

function renderNotifications() {
  const notifications = getNotifications();
  const count = document.getElementById("notificationCount");
  const list = document.getElementById("notificationList");

  count.innerText = notifications.length > 99 ? "99+" : notifications.length;

  if (!notifications.length) {
    list.innerHTML = `<div class="empty-state">No notifications.</div>`;
    return;
  }

  list.innerHTML = notifications.slice(0, 10).map(item => `
    <div class="notification-item">
      <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(item.text)}</div>
      <div class="item-meta">${escapeHtml(item.createdAt)}</div>
    </div>
  `).join("");
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("unilink_dark_mode", isDark ? "true" : "false");
}

function loadDarkMode() {
  const dark = localStorage.getItem("unilink_dark_mode") === "true";
  if (dark) document.body.classList.add("dark");
}

function statusClass(status) {
  if (status === "Pending") return "status-pending";
  if (status === "In Progress") return "status-progress";
  if (status === "Resolved") return "status-resolved";
  if (status === "Cancelled") return "status-cancelled";
  return "";
}

function priorityClass(priority) {
  if (priority === "Low") return "priority-low";
  if (priority === "Medium") return "priority-medium";
  if (priority === "High") return "priority-high";
  return "";
}

window.onload = function () {
  initData();
  loadDarkMode();

  const authPage = document.getElementById("authPage");
  const appPage = document.getElementById("appPage");

  const savedUser = localStorage.getItem("unilink_current_user");
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      currentUser.role = normalizeRole(currentUser.role);

      if (authPage) authPage.classList.add("hidden");
      if (appPage) appPage.classList.remove("hidden");

      setupPortal();
    } catch (error) {
      console.error("Invalid saved user:", error);
      localStorage.removeItem("unilink_current_user");
      if (appPage) appPage.classList.add("hidden");
      if (authPage) authPage.classList.remove("hidden");
    }
  } else {
    if (appPage) appPage.classList.add("hidden");
    if (authPage) authPage.classList.remove("hidden");
  }
};

/*
======================
HTML cần thêm để chạy đẹp
======================

1) Ở select role của login, nên để đúng value như sau:

<select id="loginRole">
  <option value="student">Student</option>
  <option value="admin">Admin</option>
</select>

2) Modal xem chi tiết cho student:

<div id="studentInquiryDetailModal" class="modal hidden">
  <div class="modal-card large">
    <div class="modal-head">
      <h3>Inquiry Details</h3>
      <button class="icon-btn" onclick="closeStudentInquiryDetails()">×</button>
    </div>
    <div id="studentInquiryDetailBody"></div>
  </div>
</div>

3) Modal edit inquiry:

<div id="editInquiryModal" class="modal hidden">
  <div class="modal-card">
    <div class="modal-head">
      <h3>Edit Inquiry</h3>
      <button class="icon-btn" onclick="closeEditInquiryModal()">×</button>
    </div>

    <div class="form-group">
      <label>Title</label>
      <input id="editInquiryTitle" type="text" />
    </div>

    <div class="form-group">
      <label>Category</label>
      <select id="editInquiryCategory">
        <option>General Support</option>
        <option>Academic Affairs</option>
        <option>Tuition & Finance</option>
        <option>IT Support</option>
        <option>Scholarship</option>
        <option>Housing</option>
        <option>Internship</option>
      </select>
    </div>

    <div class="form-group">
      <label>Priority</label>
      <select id="editInquiryPriority">
        <option>Low</option>
        <option selected>Medium</option>
        <option>High</option>
      </select>
    </div>

    <div class="form-group">
      <label>Message</label>
      <textarea id="editInquiryMessage"></textarea>
    </div>

    <div class="action-row">
      <button class="btn" onclick="closeEditInquiryModal()">Close</button>
      <button class="btn btn-primary" onclick="updateInquiryByStudent()">Save Changes</button>
    </div>
  </div>
</div>

4) CSS nên thêm:

.status-cancelled { background:#fee2e2; color:#b91c1c; }
.mini-info-box {
  padding:12px 14px;
  border:1px solid rgba(148,163,184,.18);
  border-radius:14px;
  background:rgba(248,250,252,.9);
  line-height:1.7;
}
.detail-box {
  padding:16px;
  border-radius:18px;
  border:1px solid rgba(148,163,184,.18);
  background:#fff;
}
.timeline-wrap {
  position:relative;
  display:grid;
  gap:14px;
}
.timeline-item {
  display:grid;
  grid-template-columns:18px 1fr;
  gap:12px;
  align-items:start;
}
.timeline-dot {
  width:12px;
  height:12px;
  border-radius:999px;
  background:linear-gradient(135deg, #4f46e5, #06b6d4);
  margin-top:6px;
  box-shadow:0 0 0 4px rgba(79,70,229,.12);
}
.timeline-content {
  padding:12px 14px;
  border-radius:14px;
  background:#f8fafc;
  border:1px solid rgba(148,163,184,.16);
}
.modal {
  position:fixed;
  inset:0;
  background:rgba(15,23,42,.55);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
  z-index:999;
}
.modal.hidden { display:none; }
.modal-card {
  width:min(760px, 100%);
  max-height:90vh;
  overflow:auto;
  background:#fff;
  border-radius:24px;
  padding:22px;
  box-shadow:0 24px 80px rgba(15,23,42,.18);
}
.modal-card.large {
  width:min(980px, 100%);
}
.modal-head {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:18px;
}
.icon-btn {
  width:40px;
  height:40px;
  border:none;
  border-radius:12px;
  font-size:22px;
  cursor:pointer;
}
.inquiry-card {
  border-radius:22px;
  padding:18px;
  border:1px solid rgba(148,163,184,.16);
  background:linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,.95));
  box-shadow:0 10px 30px rgba(15,23,42,.04);
}
*/