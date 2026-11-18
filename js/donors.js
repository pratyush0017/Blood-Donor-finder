/* ==========================================================================
   Blood Donor Finder - Donor Data Store & Find Donors Logic (Vanilla JS)
   Frontend-only demonstration using fictional data and localStorage.
   Modular structure allows replacing BDFStore methods with PHP/MySQL APIs later.
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    DONORS: "bdf_donors_v1",
    REQUESTS: "bdf_requests_v1",
    PROFILE: "bdf_donor_profile_v1",
    CONTACT_REQUESTS: "bdf_contact_requests_v1",
    MESSAGES: "bdf_contact_messages_v1",
    SESSION: "bdf_demo_session_v1"
  };

  /* 16 Fictional Sample Donor Records (No real personal contact info) */
  const SAMPLE_DONORS = [
    {
      id: "DNR-1001",
      name: "Aarav Sharma",
      bloodGroup: "O+",
      city: "Mumbai",
      age: 29,
      lastDonation: "2026-06-14",
      donationsCount: 6,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1002",
      name: "Meera Nair",
      bloodGroup: "A+",
      city: "Bengaluru",
      age: 26,
      lastDonation: "2026-05-20",
      donationsCount: 4,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1003",
      name: "Rohan Verma",
      bloodGroup: "B+",
      city: "Delhi",
      age: 34,
      lastDonation: "2026-09-28",
      donationsCount: 8,
      available: false,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1004",
      name: "Priya Deshmukh",
      bloodGroup: "O-",
      city: "Pune",
      age: 31,
      lastDonation: "2026-04-11",
      donationsCount: 9,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1005",
      name: "Kabir Malhotra",
      bloodGroup: "AB+",
      city: "Chandigarh",
      age: 28,
      lastDonation: "2026-07-02",
      donationsCount: 3,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1006",
      name: "Ananya Iyer",
      bloodGroup: "A-",
      city: "Chennai",
      age: 24,
      lastDonation: "2026-03-19",
      donationsCount: 2,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1007",
      name: "Siddharth Rao",
      bloodGroup: "B-",
      city: "Hyderabad",
      age: 37,
      lastDonation: "2026-10-05",
      donationsCount: 11,
      available: false,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1008",
      name: "Neha Kulkarni",
      bloodGroup: "AB-",
      city: "Mumbai",
      age: 30,
      lastDonation: "2026-06-01",
      donationsCount: 5,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1009",
      name: "Vikram Patel",
      bloodGroup: "O+",
      city: "Ahmedabad",
      age: 35,
      lastDonation: "2026-05-08",
      donationsCount: 7,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1010",
      name: "Ishita Banerjee",
      bloodGroup: "B+",
      city: "Kolkata",
      age: 27,
      lastDonation: "2026-06-22",
      donationsCount: 4,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1011",
      name: "Arjun Menon",
      bloodGroup: "A+",
      city: "Kochi",
      age: 32,
      lastDonation: "2026-10-12",
      donationsCount: 6,
      available: false,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1012",
      name: "Sanya Kapoor",
      bloodGroup: "O-",
      city: "Delhi",
      age: 25,
      lastDonation: "2026-04-29",
      donationsCount: 3,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1013",
      name: "Devansh Joshi",
      bloodGroup: "B-",
      city: "Jaipur",
      age: 29,
      lastDonation: "2026-05-15",
      donationsCount: 5,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1014",
      name: "Ritika Sen",
      bloodGroup: "A-",
      city: "Bengaluru",
      age: 33,
      lastDonation: "2026-06-30",
      donationsCount: 6,
      available: true,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1015",
      name: "Harshvardhan Singh",
      bloodGroup: "AB+",
      city: "Lucknow",
      age: 38,
      lastDonation: "2026-09-18",
      donationsCount: 10,
      available: false,
      contactRef: "Protected — Request via Platform"
    },
    {
      id: "DNR-1016",
      name: "Tanvi Choudhary",
      bloodGroup: "O+",
      city: "Pune",
      age: 23,
      lastDonation: "2026-05-27",
      donationsCount: 2,
      available: true,
      contactRef: "Protected — Request via Platform"
    }
  ];

  /* Fictional Sample Blood Requests */
  const SAMPLE_REQUESTS = [
    {
      id: "REQ-2041",
      patientName: "Ramesh Kumar (Sample)",
      bloodGroup: "O-",
      hospital: "City Care Multi-Specialty Hospital",
      city: "Pune",
      units: 2,
      contact: "Demo Contact Protected",
      priority: "Critical",
      description: "Urgent requirement for scheduled cardiac procedure.",
      status: "Pending",
      createdAt: "2026-11-18"
    },
    {
      id: "REQ-2042",
      patientName: "Sunita Devi (Sample)",
      bloodGroup: "O+",
      hospital: "Metro Health Institute",
      city: "Mumbai",
      units: 3,
      contact: "Demo Contact Protected",
      priority: "Critical",
      description: "Emergency trauma support needed within 6 hours.",
      status: "Pending",
      createdAt: "2026-11-18"
    },
    {
      id: "REQ-2043",
      patientName: "Karan Mehta (Sample)",
      bloodGroup: "A+",
      hospital: "St. Jude Medical Center",
      city: "Bengaluru",
      units: 1,
      contact: "Demo Contact Protected",
      priority: "Urgent",
      description: "Post-operative hemoglobin replenishment.",
      status: "Matched",
      createdAt: "2026-11-17"
    },
    {
      id: "REQ-2044",
      patientName: "Farida Begum (Sample)",
      bloodGroup: "B+",
      hospital: "Lifeline General Hospital",
      city: "Delhi",
      units: 2,
      contact: "Demo Contact Protected",
      priority: "Urgent",
      description: "Required for oncology supportive care.",
      status: "Pending",
      createdAt: "2026-11-17"
    },
    {
      id: "REQ-2045",
      patientName: "Nikhil Roy (Sample)",
      bloodGroup: "AB-",
      hospital: "Eastern Heart Hospital",
      city: "Kolkata",
      units: 1,
      contact: "Demo Contact Protected",
      priority: "Standard",
      description: "Planned orthopedic surgery later this week.",
      status: "Fulfilled",
      createdAt: "2026-11-15"
    },
    {
      id: "REQ-2046",
      patientName: "Deepak Nair (Sample)",
      bloodGroup: "A-",
      hospital: "Sunrise Medical Clinic",
      city: "Chennai",
      units: 2,
      contact: "Demo Contact Protected",
      priority: "Critical",
      description: "Immediate blood unit needed for ICU admission.",
      status: "Pending",
      createdAt: "2026-11-18"
    }
  ];

  /* Default Fictional Donor Profile for Donor Dashboard */
  const SAMPLE_PROFILE = {
    id: "DNR-1001",
    name: "Aarav Sharma",
    email: "aarav.demo@bloodfinder.example",
    phone: "+91 90000 00101 (Demo)",
    age: 29,
    bloodGroup: "O+",
    city: "Mumbai",
    address: "42 Palm Avenue, Andheri West, Mumbai (Sample)",
    lastDonation: "2026-06-14",
    memberSince: "2023-02-10",
    available: true,
    respondedRequestIds: [],
    donationHistory: [
      {
        date: "2026-06-14",
        center: "Metro Health Blood Bank, Mumbai",
        units: "1 Unit (450 ml)",
        status: "Completed"
      },
      {
        date: "2026-01-19",
        center: "Red Cross Community Camp, Mumbai",
        units: "1 Unit (450 ml)",
        status: "Completed"
      },
      {
        date: "2025-08-05",
        center: "City Care Hospital Drive, Mumbai",
        units: "1 Unit (450 ml)",
        status: "Completed"
      },
      {
        date: "2025-02-22",
        center: "Civic Medical Center, Mumbai",
        units: "1 Unit (450 ml)",
        status: "Completed"
      }
    ]
  };

  /* Blood Donation Compatibility Map (Who a donor can donate red blood cells to) */
  const DONATION_COMPATIBILITY = {
    "O-": "All blood types (Universal Donor)",
    "O+": "O+, A+, B+, AB+",
    "A-": "A-, A+, AB-, AB+",
    "A+": "A+, AB+",
    "B-": "B-, B+, AB-, AB+",
    "B+": "B+, AB+",
    "AB-": "AB-, AB+",
    "AB+": "AB+ only"
  };

  /* Helper: Safe JSON read/write with fallback */
  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        const cloned = JSON.parse(JSON.stringify(fallback));
        localStorage.setItem(key, JSON.stringify(cloned));
        return cloned;
      }
      return JSON.parse(raw);
    } catch (err) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* Storage unavailable (e.g., restricted private mode) */
    }
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getInitials(name) {
    const parts = String(name || "BD").trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /* Public Data Store API (Ready for future PHP/MySQL migration) */
  const BDFStore = {
    STORAGE_KEYS: STORAGE_KEYS,
    DONATION_COMPATIBILITY: DONATION_COMPATIBILITY,
    escapeHtml: escapeHtml,
    getInitials: getInitials,

    getDonors: function () {
      return readStorage(STORAGE_KEYS.DONORS, SAMPLE_DONORS);
    },

    saveDonors: function (donors) {
      writeStorage(STORAGE_KEYS.DONORS, donors);
    },

    addDonor: function (donorInput) {
      const donors = this.getDonors();
      const newDonor = {
        id: "DNR-" + (1000 + donors.length + Math.floor(Math.random() * 90 + 10)),
        name: donorInput.name.trim(),
        bloodGroup: donorInput.bloodGroup,
        city: donorInput.city.trim(),
        age: Number(donorInput.age),
        lastDonation: donorInput.lastDonation || "First-time Donor",
        donationsCount: donorInput.lastDonation ? 1 : 0,
        available: Boolean(donorInput.available),
        contactRef: "Protected — Request via Platform"
      };
      donors.unshift(newDonor);
      this.saveDonors(donors);
      return newDonor;
    },

    updateDonor: function (id, updates) {
      const donors = this.getDonors();
      const idx = donors.findIndex(function (d) { return d.id === id; });
      if (idx !== -1) {
        donors[idx] = Object.assign({}, donors[idx], updates);
        this.saveDonors(donors);
        return donors[idx];
      }
      return null;
    },

    deleteDonor: function (id) {
      const donors = this.getDonors().filter(function (d) { return d.id !== id; });
      this.saveDonors(donors);
      return donors;
    },

    getRequests: function () {
      return readStorage(STORAGE_KEYS.REQUESTS, SAMPLE_REQUESTS);
    },

    saveRequests: function (requests) {
      writeStorage(STORAGE_KEYS.REQUESTS, requests);
    },

    addRequest: function (reqInput) {
      const requests = this.getRequests();
      const today = new Date().toISOString().split("T")[0];
      const newReq = {
        id: "REQ-" + (2050 + requests.length + Math.floor(Math.random() * 90)),
        patientName: reqInput.patientName.trim(),
        bloodGroup: reqInput.bloodGroup,
        hospital: reqInput.hospital.trim(),
        city: reqInput.city.trim(),
        units: Number(reqInput.units),
        contact: "Demo Contact Protected",
        priority: reqInput.priority,
        description: reqInput.description.trim() || "No additional notes provided.",
        status: "Pending",
        createdAt: today
      };
      requests.unshift(newReq);
      this.saveRequests(requests);
      return newReq;
    },

    updateRequest: function (id, updates) {
      const requests = this.getRequests();
      const idx = requests.findIndex(function (r) { return r.id === id; });
      if (idx !== -1) {
        requests[idx] = Object.assign({}, requests[idx], updates);
        this.saveRequests(requests);
        return requests[idx];
      }
      return null;
    },

    deleteRequest: function (id) {
      const requests = this.getRequests().filter(function (r) { return r.id !== id; });
      this.saveRequests(requests);
      return requests;
    },

    getDonorProfile: function () {
      return readStorage(STORAGE_KEYS.PROFILE, SAMPLE_PROFILE);
    },

    updateDonorProfile: function (updates) {
      const current = this.getDonorProfile();
      const updated = Object.assign({}, current, updates);
      writeStorage(STORAGE_KEYS.PROFILE, updated);
      /* Keep matching donor record in directory synced */
      if (updated.id) {
        this.updateDonor(updated.id, {
          name: updated.name,
          bloodGroup: updated.bloodGroup,
          city: updated.city,
          age: Number(updated.age),
          lastDonation: updated.lastDonation || "First-time Donor",
          available: Boolean(updated.available)
        });
      }
      return updated;
    },

    addContactRequest: function (entry) {
      const list = readStorage(STORAGE_KEYS.CONTACT_REQUESTS, []);
      list.unshift(Object.assign({}, entry, {
        createdAt: new Date().toISOString()
      }));
      writeStorage(STORAGE_KEYS.CONTACT_REQUESTS, list);
      return list;
    },

    addContactMessage: function (msg) {
      const list = readStorage(STORAGE_KEYS.MESSAGES, []);
      list.unshift(Object.assign({}, msg, {
        createdAt: new Date().toISOString()
      }));
      writeStorage(STORAGE_KEYS.MESSAGES, list);
      return list;
    },

    setSession: function (sessionData) {
      writeStorage(STORAGE_KEYS.SESSION, sessionData);
    },

    getSession: function () {
      return readStorage(STORAGE_KEYS.SESSION, null);
    },

    resetDemoData: function () {
      writeStorage(STORAGE_KEYS.DONORS, SAMPLE_DONORS);
      writeStorage(STORAGE_KEYS.REQUESTS, SAMPLE_REQUESTS);
      writeStorage(STORAGE_KEYS.PROFILE, SAMPLE_PROFILE);
      writeStorage(STORAGE_KEYS.CONTACT_REQUESTS, []);
    }
  };

  window.BDFStore = BDFStore;

  /* ========================================================================
     Find Blood Donors Page Controller (find-donors.html)
     ======================================================================== */
  function initFindDonorsPage() {
    const donorGrid = document.getElementById("donorResultsGrid");
    if (!donorGrid) return;

    const bloodFilter = document.getElementById("filterBloodGroup");
    const cityInput = document.getElementById("filterCity");
    const availabilityFilter = document.getElementById("filterAvailability");
    const clearBtn = document.getElementById("clearFiltersBtn");
    const resultsCount = document.getElementById("resultsCount");
    const chipButtons = document.querySelectorAll("[data-blood-chip]");

    /* Modal Elements for Privacy-Safe Contact Request */
    const contactModal = document.getElementById("contactRequestModal");
    const modalDonorInfo = document.getElementById("modalDonorInfo");
    const modalDonorId = document.getElementById("modalDonorId");
    const contactRequestForm = document.getElementById("contactRequestForm");
    const closeModalBtns = document.querySelectorAll("[data-close-modal='contactRequestModal']");

    /* Read query parameter ?bloodGroup=O+ if coming from Home page cards */
    const urlParams = new URLSearchParams(window.location.search);
    const initialBlood = urlParams.get("bloodGroup");
    if (initialBlood && bloodFilter) {
      const hasOption = Array.from(bloodFilter.options).some(function (opt) {
        return opt.value === initialBlood;
      });
      if (hasOption) {
        bloodFilter.value = initialBlood;
      }
    }

    function syncChips() {
      const selected = bloodFilter ? bloodFilter.value : "all";
      chipButtons.forEach(function (chip) {
        const val = chip.getAttribute("data-blood-chip");
        chip.classList.toggle("active", val === selected);
      });
    }

    function renderDonors() {
      const allDonors = BDFStore.getDonors();
      const selectedBlood = bloodFilter ? bloodFilter.value : "all";
      const cityQuery = cityInput ? cityInput.value.trim().toLowerCase() : "";
      const selectedAvail = availabilityFilter ? availabilityFilter.value : "all";

      const filtered = allDonors.filter(function (donor) {
        const matchBlood = selectedBlood === "all" || donor.bloodGroup === selectedBlood;
        const matchCity = !cityQuery || donor.city.toLowerCase().includes(cityQuery);
        const matchAvail =
          selectedAvail === "all" ||
          (selectedAvail === "available" && donor.available) ||
          (selectedAvail === "unavailable" && !donor.available);
        return matchBlood && matchCity && matchAvail;
      });

      if (resultsCount) {
        const label = filtered.length === 1 ? "donor" : "donors";
        resultsCount.textContent = "Showing " + filtered.length + " of " + allDonors.length + " " + label;
      }

      if (filtered.length === 0) {
        donorGrid.innerHTML =
          '<div class="empty-state">' +
          "<h3>No matching blood donors found</h3>" +
          "<p>Try broadening your city search, selecting another blood group, or clearing active filters.</p>" +
          '<button type="button" class="btn btn-primary btn-sm" data-action="reset-empty-filters">Reset All Filters</button>' +
          "</div>";
        return;
      }

      donorGrid.innerHTML = filtered
        .map(function (donor) {
          const statusClass = donor.available ? "badge-available" : "badge-unavailable";
          const statusLabel = donor.available ? "Available" : "Unavailable";
          const btnDisabled = donor.available ? "" : " disabled";
          const btnLabel = donor.available ? "Contact Request" : "Currently Unavailable";
          const btnClass = donor.available ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm";

          return (
            '<article class="donor-card">' +
              '<div class="donor-card-top">' +
                '<div class="donor-identity">' +
                  '<div class="avatar-circle" aria-hidden="true">' + escapeHtml(getInitials(donor.name)) + "</div>" +
                  "<div>" +
                    '<h3 class="donor-name">' + escapeHtml(donor.name) + "</h3>" +
                    '<p class="donor-city">' + escapeHtml(donor.city) + "</p>" +
                  "</div>" +
                "</div>" +
                '<span class="badge badge-blood">' + escapeHtml(donor.bloodGroup) + "</span>" +
              "</div>" +
              '<div class="donor-meta">' +
                "<div>" +
                  '<span class="donor-meta-label">Availability</span>' +
                  '<span class="badge ' + statusClass + '">' + statusLabel + "</span>" +
                "</div>" +
                "<div>" +
                  '<span class="donor-meta-label">Last Donation</span>' +
                  '<span class="donor-meta-value">' + escapeHtml(donor.lastDonation) + "</span>" +
                "</div>" +
              "</div>" +
              '<div class="donor-card-footer">' +
                '<span class="privacy-note">Contact protected</span>' +
                '<button type="button" class="' + btnClass + '" data-action="contact-donor" data-donor-id="' + escapeHtml(donor.id) + '"' + btnDisabled + ">" +
                  btnLabel +
                "</button>" +
              "</div>" +
            "</article>"
          );
        })
        .join("");
    }

    function resetFilters() {
      if (bloodFilter) bloodFilter.value = "all";
      if (cityInput) cityInput.value = "";
      if (availabilityFilter) availabilityFilter.value = "all";
      syncChips();
      renderDonors();
    }

    function openContactModal(donorId) {
      const donor = BDFStore.getDonors().find(function (d) { return d.id === donorId; });
      if (!donor || !contactModal) return;

      if (modalDonorId) modalDonorId.value = donor.id;
      if (modalDonorInfo) {
        modalDonorInfo.textContent =
          "Sending a privacy-protected demo contact request to " +
          donor.name +
          " (" +
          donor.bloodGroup +
          ", " +
          donor.city +
          "). Personal phone numbers and emails are never publicly displayed.";
      }
      contactModal.classList.add("is-open");
      contactModal.setAttribute("aria-hidden", "false");
    }

    function closeContactModal() {
      if (!contactModal) return;
      contactModal.classList.remove("is-open");
      contactModal.setAttribute("aria-hidden", "true");
      if (contactRequestForm) contactRequestForm.reset();
    }

    if (bloodFilter) {
      bloodFilter.addEventListener("change", function () {
        syncChips();
        renderDonors();
      });
    }

    if (cityInput) {
      cityInput.addEventListener("input", renderDonors);
    }

    if (availabilityFilter) {
      availabilityFilter.addEventListener("change", renderDonors);
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", resetFilters);
    }

    chipButtons.forEach(function (chip) {
      chip.addEventListener("click", function () {
        const val = chip.getAttribute("data-blood-chip");
        if (bloodFilter) bloodFilter.value = val;
        syncChips();
        renderDonors();
      });
    });

    donorGrid.addEventListener("click", function (event) {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      const action = target.getAttribute("data-action");
      if (action === "reset-empty-filters") {
        resetFilters();
      } else if (action === "contact-donor") {
        openContactModal(target.getAttribute("data-donor-id"));
      }
    });

    closeModalBtns.forEach(function (btn) {
      btn.addEventListener("click", closeContactModal);
    });

    if (contactModal) {
      contactModal.addEventListener("click", function (event) {
        if (event.target === contactModal) closeContactModal();
      });
    }

    if (contactRequestForm) {
      contactRequestForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const requesterName = document.getElementById("crRequesterName");
        const hospitalName = document.getElementById("crHospital");
        const note = document.getElementById("crNote");
        const errorBox = document.getElementById("contactModalError");

        if (!requesterName.value.trim() || !hospitalName.value.trim()) {
          if (errorBox) {
            errorBox.textContent = "Please enter your name and hospital or medical center.";
            errorBox.classList.remove("hidden");
          }
          return;
        }

        if (errorBox) errorBox.classList.add("hidden");

        BDFStore.addContactRequest({
          donorId: modalDonorId ? modalDonorId.value : "",
          requesterName: requesterName.value.trim(),
          hospital: hospitalName.value.trim(),
          note: note ? note.value.trim() : ""
        });

        closeContactModal();
        if (window.BDFUI && window.BDFUI.showToast) {
          window.BDFUI.showToast("Demo contact request recorded locally. No real notification was sent.", "success");
        }
      });
    }

    syncChips();
    renderDonors();
  }

  document.addEventListener("DOMContentLoaded", initFindDonorsPage);
})();
