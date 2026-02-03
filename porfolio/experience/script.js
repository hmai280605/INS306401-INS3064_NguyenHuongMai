$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // emailjs (giữ nguyên – nếu chưa dùng thì vẫn ok)
    $("#contact-form").submit(function (event) {
        emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function () {
                document.getElementById("contact-form").reset();
                alert("Form submitted successfully!");
            }, function () {
                alert("Form submission failed!");
            });

        event.preventDefault();
    });

});

/* ================= TAB TITLE ================= */
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Portfolio | Hương Mai";
        $("#favicon").attr("href", "assets/images/favicon.png");
    } else {
        document.title = "Come back to Hương Mai's Portfolio 💻";
        $("#favicon").attr("href", "assets/images/favhand.png");
    }
});

/* ================= TYPING TEXT (ĐÃ SỬA) ================= */
var typed = new Typed(".typing-text", {
    strings: [
        "Web Design",
        "MIS Projects",
        "UI/UX",
        "Learning JavaScript"
    ],
    loop: true,
    typeSpeed: 60,
    backSpeed: 30,
    backDelay: 800,
});

/* ================= FETCH DATA ================= */
async function fetchData(type = "skills") {
    let response;
    type === "skills"
        ? response = await fetch("skills.json")
        : response = await fetch("./projects/projects.json");

    const data = await response.json();
    return data;
}

/* ================= SKILLS ================= */
function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";

    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
            <div class="info">
                <img src="${skill.icon}" alt="skill" />
                <span>${skill.name}</span>
            </div>
        </div>`;
    });

    skillsContainer.innerHTML = skillHTML;
}

/* ================= PROJECTS ================= */
function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";

    projects.slice(0, 6).forEach(project => {
        projectHTML += `
        <div class="box tilt">
            <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
            <div class="content">
                <div class="tag">
                    <h3>${project.name}</h3>
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    <div class="btns">
                        <a href="${project.links.view}" class="btn" target="_blank">
                            <i class="fas fa-eye"></i> View
                        </a>
                        <a href="${project.links.code}" class="btn" target="_blank">
                            Code <i class="fas fa-code"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    });

    projectsContainer.innerHTML = projectHTML;

    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });

    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    srtop.reveal('.work .box', { interval: 200 });
}

/* ================= LOAD DATA ================= */
fetchData().then(data => showSkills(data));
fetchData("projects").then(data => showProjects(data));

/* ================= TILT ================= */
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});

/* ================= DISABLE DEV TOOLS ================= */
document.onkeydown = function (e) {
    if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(String.fromCharCode(e.keyCode))) ||
        (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
    ) {
        return false;
    }
};

/* ================= SCROLL REVEAL ================= */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.home .content', { delay: 200 });
srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.about .content', { delay: 200 });
srtop.reveal('.skills .bar', { interval: 200 });
srtop.reveal('.education .box', { interval: 200 });
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.contact .container', { delay: 400 });
