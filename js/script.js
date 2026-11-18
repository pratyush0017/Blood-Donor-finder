/* ==========================================================================
   Blood Donor Finder - Common UI, Validation & Page Interactions (Vanilla JS)
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Toast Notification Utility ---------- */
  function getToastContainer() {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type) {
    const container = getToastContainer();
    const toast = document.createElement("div");
    toast.className = "toast" + (type ? " toast-" + type : "");
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 4200);
  }

  /* ---------- Form Validation Helpers ---------- */
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_REGEX = /^[+]?[\d\s\-()]{10,16}$/;

  function isValidEmail(email) {
    return EMAIL_REGEX.test(String(email || "").trim());
  }

  function isValidPhone(phone) {
    const raw = String(phone || "").trim();
    const digitsOnly = raw.replace(/\D/g, "");
    return PHONE_REGEX.test(raw) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }

  function setFieldError(inputEl, message) {
    if (!inputEl) return;
    const errorEl = document.getElementById(inputEl.id + "Error");
    if (message) {
      inputEl.classList.add("is-invalid");
      inputEl.classList.remove("is-valid");
      inputEl.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = message;
    } else {
      inputEl.classList.remove("is-invalid");
      inputEl.classList.add("is-valid");
      inputEl.removeAttribute("aria-invalid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function clearFormValidation(form) {
    if (!form) return;
    form.querySelectorAll(".form-control").forEach(function (field) {
      field.classList.remove("is-invalid", "is-valid");
      field.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach(function (err) {
      err.textContent = "";
    });
  }

  function showFormAlert(alertEl, type, title, message) {
    if (!alertEl) return;
    alertEl.className = "alert alert-" + type;
    alertEl.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = title;
    const span = document.createElement("span");
    span.textContent = message;
    alertEl.appendChild(strong);
    alertEl.appendChild(span);
    alertEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  window.BDFUI = {
    showToast: showToast,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    setFieldError: setFieldError,
    clearFormValidation: clearFormValidation,
    showFormAlert: showFormAlert
  };

  /* ---------- Mobile Navigation & Escape Handler ---------- */
  function initMobileNav() {
    const toggleBtn = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    if (!toggleBtn || !navMenu) return;

    function closeMenu() {
      navMenu.classList.remove("is-open");
      toggleBtn.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }

    toggleBtn.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      toggleBtn.classList.toggle("is-open", isOpen);
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        document.querySelectorAll(".modal-backdrop.is-open").forEach(function (modal) {
          modal.classList.remove("is-open");
          modal.setAttribute("aria-hidden", "true");
        });
      }
    });
  }

  /* ---------- Smooth Scrolling for In-Page Anchors ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ---------- Subtle Scroll Reveal Animation ---------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Home Page Blood Group Card Live Counts ---------- */
  function initHomeBloodCounts() {
    const badges = document.querySelectorAll("[data-blood-count]");
    if (!badges.length || !window.BDFStore) return;

    const donors = window.BDFStore.getDonors();
    badges.forEach(function (badge) {
      const group = badge.getAttribute("data-blood-count");
      const count = donors.filter(function (d) { return d.bloodGroup === group; }).length;
      badge.textContent = count + (count === 1 ? " Sample Donor" : " Sample Donors");
    });
  }

  /* ---------- Donor Registration Form (register.html) ---------- */
  function initRegistrationForm() {
    const form = document.getElementById("donorRegistrationForm");
    if (!form || !window.BDFStore) return;

    const alertBox = document.getElementById("registerAlert");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let isValid = true;

      const fullName = document.getElementById("regFullName");
      const email = document.getElementById("regEmail");
      const password = document.getElementById("regPassword");
      const age = document.getElementById("regAge");
      const bloodGroup = document.getElementById("regBloodGroup");
      const phone = document.getElementById("regPhone");
      const city = document.getElementById("regCity");
      const address = document.getElementById("regAddress");
      const lastDonation = document.getElementById("regLastDonation");
      const available = document.getElementById("regAvailable");

      if (!fullName.value.trim() || fullName.value.trim().length < 2) {
        setFieldError(fullName, "Please enter your full name (at least 2 characters).");
        isValid = false;
      } else {
        setFieldError(fullName, "");
      }

      if (!isValidEmail(email.value)) {
        setFieldError(email, "Please enter a valid email address.");
        isValid = false;
      } else {
        setFieldError(email, "");
      }

      if (!password.value || password.value.length < 6) {
        setFieldError(password, "Password must be at least 6 characters long.");
        isValid = false;
      } else {
        setFieldError(password, "");
      }

      const ageNum = Number(age.value);
      if (!age.value || Number.isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        setFieldError(age, "Eligible donor age must be between 18 and 65 years.");
        isValid = false;
      } else {
        setFieldError(age, "");
      }

      if (!bloodGroup.value) {
        setFieldError(bloodGroup, "Please select your blood group.");
        isValid = false;
      } else {
        setFieldError(bloodGroup, "");
      }

      if (!isValidPhone(phone.value)) {
        setFieldError(phone, "Please enter a valid 10 to 15 digit phone number.");
        isValid = false;
      } else {
        setFieldError(phone, "");
      }

      if (!city.value.trim()) {
        setFieldError(city, "Please enter your city.");
        isValid = false;
      } else {
        setFieldError(city, "");
      }

      if (!address.value.trim() || address.value.trim().length < 5) {
        setFieldError(address, "Please enter your residential address.");
        isValid = false;
      } else {
        setFieldError(address, "");
      }

      if (lastDonation.value) {
        const selectedDate = new Date(lastDonation.value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) {
          setFieldError(lastDonation, "Last donation date cannot be in the future.");
          isValid = false;
        } else {
          setFieldError(lastDonation, "");
        }
      } else {
        setFieldError(lastDonation, "");
      }

      if (!isValid) {
        showFormAlert(
          alertBox,
          "error",
          "Please review the highlighted fields.",
          "Fix the validation errors below before submitting your demonstration registration."
        );
        return;
      }

      const createdDonor = window.BDFStore.addDonor({
        name: fullName.value.trim(),
        bloodGroup: bloodGroup.value,
        city: city.value.trim(),
        age: ageNum,
        lastDonation: lastDonation.value || "First-time Donor",
        available: available.checked
      });

      /* Sync active demo donor profile so Donor Dashboard reflects the latest registration */
      window.BDFStore.updateDonorProfile({
        id: createdDonor.id,
        name: createdDonor.name,
        email: email.value.trim(),
        phone: "Protected Demo Number",
        age: ageNum,
        bloodGroup: bloodGroup.value,
        city: city.value.trim(),
        address: address.value.trim(),
        lastDonation: lastDonation.value || "First-time Donor",
        available: available.checked
      });

      showFormAlert(
        alertBox,
        "success",
        "Demo Registration Saved! (ID: " + createdDonor.id + ")",
        createdDonor.name +
          " (" +
          createdDonor.bloodGroup +
          ", " +
          createdDonor.city +
          ") has been stored in localStorage. You can now view this record in Find Donors or Donor Dashboard."
      );
      showToast("Donor registered locally in demo storage.", "success");

      form.reset();
      clearFormValidation(form);
    });
  }

  /* ---------- Blood Request Form (request-blood.html) ---------- */
  function initBloodRequestForm() {
    const form = document.getElementById("bloodRequestForm");
    if (!form || !window.BDFStore) return;

    const alertBox = document.getElementById("requestAlert");
    const recentContainer = document.getElementById("recentRequestsPreview");

    function renderRecentPreview() {
      if (!recentContainer) return;
      const requests = window.BDFStore.getRequests().slice(0, 4);
      const esc = window.BDFStore.escapeHtml;

      recentContainer.innerHTML = requests
        .map(function (req) {
          const priorityClass =
            req.priority === "Critical"
              ? "badge-critical"
              : req.priority === "Urgent"
                ? "badge-urgent"
                : "badge-standard";

          return (
            '<div class="request-item">' +
              '<div class="request-item-main">' +
                "<h4>" + esc(req.patientName) + ' <span class="badge badge-blood">' + esc(req.bloodGroup) + "</span></h4>" +
                '<div class="request-item-meta">' +
                  "<span>" + esc(req.hospital) + ", " + esc(req.city) + "</span>" +
                  "<span>" + esc(req.units) + (req.units === 1 ? " Unit" : " Units") + "</span>" +
                "</div>" +
              "</div>" +
              '<span class="badge ' + priorityClass + '">' + esc(req.priority) + "</span>" +
            "</div>"
          );
        })
        .join("");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let isValid = true;

      const patientName = document.getElementById("reqPatientName");
      const bloodGroup = document.getElementById("reqBloodGroup");
      const hospital = document.getElementById("reqHospital");
      const city = document.getElementById("reqCity");
      const units = document.getElementById("reqUnits");
      const contact = document.getElementById("reqContact");
      const priority = document.getElementById("reqPriority");
      const description = document.getElementById("reqDescription");

      if (!patientName.value.trim() || patientName.value.trim().length < 2) {
        setFieldError(patientName, "Please enter the patient's full name.");
        isValid = false;
      } else {
        setFieldError(patientName, "");
      }

      if (!bloodGroup.value) {
        setFieldError(bloodGroup, "Please select the required blood group.");
        isValid = false;
      } else {
        setFieldError(bloodGroup, "");
      }

      if (!hospital.value.trim()) {
        setFieldError(hospital, "Please enter the hospital name.");
        isValid = false;
      } else {
        setFieldError(hospital, "");
      }

      if (!city.value.trim()) {
        setFieldError(city, "Please enter the city.");
        isValid = false;
      } else {
        setFieldError(city, "");
      }

      const unitCount = Number(units.value);
      if (!units.value || Number.isNaN(unitCount) || unitCount < 1 || unitCount > 10) {
        setFieldError(units, "Enter a valid unit count between 1 and 10.");
        isValid = false;
      } else {
        setFieldError(units, "");
      }

      if (!isValidPhone(contact.value)) {
        setFieldError(contact, "Please enter a valid 10 to 15 digit contact number.");
        isValid = false;
      } else {
        setFieldError(contact, "");
      }

      if (!priority.value) {
        setFieldError(priority, "Please select an emergency priority level.");
        isValid = false;
      } else {
        setFieldError(priority, "");
      }

      if (!description.value.trim() || description.value.trim().length < 10) {
        setFieldError(description, "Please provide brief medical details (at least 10 characters).");
        isValid = false;
      } else {
        setFieldError(description, "");
      }

      if (!isValid) {
        showFormAlert(
          alertBox,
          "error",
          "Incomplete Blood Request Form",
          "Please correct the highlighted fields before submitting."
        );
        return;
      }

      const created = window.BDFStore.addRequest({
        patientName: patientName.value.trim(),
        bloodGroup: bloodGroup.value,
        hospital: hospital.value.trim(),
        city: city.value.trim(),
        units: unitCount,
        priority: priority.value,
        description: description.value.trim()
      });

      showFormAlert(
        alertBox,
        "success",
        "Demo Blood Request Logged! (" + created.id + ")",
        "Stored locally in your browser for demonstration only. No real emergency dispatch was sent."
      );
      showToast("Blood request added to local demo storage.", "success");

      form.reset();
      clearFormValidation(form);
      renderRecentPreview();
    });

    renderRecentPreview();
  }

  /* ---------- Demo Login Page (login.html) ---------- */
  function initLoginPage() {
    const form = document.getElementById("demoLoginForm");
    if (!form) return;

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const rememberInput = document.getElementById("loginRemember");
    const alertBox = document.getElementById("loginAlert");
    const fillDonorBtn = document.getElementById("fillDemoDonor");
    const fillAdminBtn = document.getElementById("fillDemoAdmin");

    /* Forgot password demo modal */
    const forgotTrigger = document.getElementById("forgotPasswordLink");
    const forgotModal = document.getElementById("forgotPasswordModal");
    const forgotForm = document.getElementById("forgotPasswordForm");
    const closeForgotBtns = document.querySelectorAll("[data-close-modal='forgotPasswordModal']");

    let selectedRole = "donor";

    if (fillDonorBtn) {
      fillDonorBtn.addEventListener("click", function () {
        selectedRole = "donor";
        emailInput.value = "aarav.demo@bloodfinder.example";
        passwordInput.value = "demo1234";
        clearFormValidation(form);
        showToast("Demo Donor credentials filled.", "info");
      });
    }

    if (fillAdminBtn) {
      fillAdminBtn.addEventListener("click", function () {
        selectedRole = "admin";
        emailInput.value = "admin.demo@bloodfinder.example";
        passwordInput.value = "admin1234";
        clearFormValidation(form);
        showToast("Demo Admin credentials filled.", "info");
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let isValid = true;

      if (!isValidEmail(emailInput.value)) {
        setFieldError(emailInput, "Please enter a valid email address.");
        isValid = false;
      } else {
        setFieldError(emailInput, "");
      }

      if (!passwordInput.value || passwordInput.value.length < 6) {
        setFieldError(passwordInput, "Please enter a password (at least 6 characters).");
        isValid = false;
      } else {
        setFieldError(passwordInput, "");
      }

      if (!isValid) {
        showFormAlert(
          alertBox,
          "error",
          "Validation Error",
          "Please enter a valid demo email and password."
        );
        return;
      }

      const isAdminEmail = emailInput.value.trim().toLowerCase().includes("admin");
      const role = isAdminEmail ? "admin" : selectedRole;
      const targetUrl = role === "admin" ? "admin-dashboard.html" : "donor-dashboard.html";

      if (window.BDFStore) {
        window.BDFStore.setSession({
          email: emailInput.value.trim(),
          role: role,
          remember: Boolean(rememberInput && rememberInput.checked),
          loggedInAt: new Date().toISOString()
        });
      }

      showFormAlert(
        alertBox,
        "success",
        "Demo Login Successful!",
        "Redirecting to the " + (role === "admin" ? "Admin Dashboard" : "Donor Dashboard") + " (frontend demo only)..."
      );
      showToast("Demo session started.", "success");

      setTimeout(function () {
        window.location.href = targetUrl;
      }, 900);
    });

    if (forgotTrigger && forgotModal) {
      forgotTrigger.addEventListener("click", function (event) {
        event.preventDefault();
        forgotModal.classList.add("is-open");
        forgotModal.setAttribute("aria-hidden", "false");
      });

      closeForgotBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          forgotModal.classList.remove("is-open");
          forgotModal.setAttribute("aria-hidden", "true");
        });
      });

      forgotModal.addEventListener("click", function (event) {
        if (event.target === forgotModal) {
          forgotModal.classList.remove("is-open");
          forgotModal.setAttribute("aria-hidden", "true");
        }
      });
    }

    if (forgotForm) {
      forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const resetEmail = document.getElementById("resetEmail");
        const resetErr = document.getElementById("resetEmailError");
        if (!isValidEmail(resetEmail.value)) {
          if (resetErr) resetErr.textContent = "Please enter a valid email address.";
          return;
        }
        if (resetErr) resetErr.textContent = "";
        forgotModal.classList.remove("is-open");
        forgotModal.setAttribute("aria-hidden", "true");
        forgotForm.reset();
        showToast("Demo password reset confirmation displayed (no real email sent).", "info");
      });
    }
  }

  /* ---------- Contact Form (contact.html) ---------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const alertBox = document.getElementById("contactAlert");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let isValid = true;

      const name = document.getElementById("contactName");
      const email = document.getElementById("contactEmail");
      const subject = document.getElementById("contactSubject");
      const message = document.getElementById("contactMessage");

      if (!name.value.trim() || name.value.trim().length < 2) {
        setFieldError(name, "Please enter your name.");
        isValid = false;
      } else {
        setFieldError(name, "");
      }

      if (!isValidEmail(email.value)) {
        setFieldError(email, "Please enter a valid email address.");
        isValid = false;
      } else {
        setFieldError(email, "");
      }

      if (!subject.value.trim() || subject.value.trim().length < 3) {
        setFieldError(subject, "Please enter a subject (at least 3 characters).");
        isValid = false;
      } else {
        setFieldError(subject, "");
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        setFieldError(message, "Please write a message of at least 10 characters.");
        isValid = false;
      } else {
        setFieldError(message, "");
      }

      if (!isValid) {
        showFormAlert(
          alertBox,
          "error",
          "Please check your message details.",
          "Fix the highlighted fields before sending."
        );
        return;
      }

      if (window.BDFStore) {
        window.BDFStore.addContactMessage({
          name: name.value.trim(),
          email: email.value.trim(),
          subject: subject.value.trim(),
          message: message.value.trim()
        });
      }

      showFormAlert(
        alertBox,
        "success",
        "Demo Message Received!",
        "Thank you, " + name.value.trim() + ". Your inquiry has been stored locally for demonstration purposes."
      );
      showToast("Contact message submitted (demo mode).", "success");

      form.reset();
      clearFormValidation(form);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initSmoothScroll();
    initScrollReveal();
    initHomeBloodCounts();
    initRegistrationForm();
    initBloodRequestForm();
    initLoginPage();
    initContactForm();
  });
})();
