/* ==========================================================================
   Blood Donor Finder - Donor & Admin Dashboard Logic (Vanilla JS)
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     1. DONOR DASHBOARD CONTROLLER (donor-dashboard.html)
     ======================================================================== */
  function initDonorDashboard() {
    const dashboardRoot = document.getElementById("donorDashboardRoot");
    if (!dashboardRoot || !window.BDFStore) return;

    const store = window.BDFStore;
    const esc = store.escapeHtml;

    const avatarEl = document.getElementById("donorAvatar");
    const nameEl = document.getElementById("donorName");
    const cityBadgeEl = document.getElementById("donorCityMeta");
    const bloodGroupEl = document.getElementById("donorBloodGroup");
    const compatEl = document.getElementById("donorCompatibility");
    const availToggle = document.getElementById("availabilityToggle");
    const availBadge = document.getElementById("availabilityBadge");
    const emailEl = document.getElementById("profileEmail");
    const ageEl = document.getElementById("profileAge");
    const cityEl = document.getElementById("profileCity");
    const addressEl = document.getElementById("profileAddress");
    const lastDonationEl = document.getElementById("profileLastDonation");
    const totalDonationsEl = document.getElementById("donorTotalDonations");
    const livesImpactedEl = document.getElementById("donorLivesImpacted");
    const historyBody = document.getElementById("donationHistoryBody");
    const recentRequestsList = document.getElementById("donorRecentRequests");

    /* Edit Profile Modal Elements */
    const editProfileBtn = document.getElementById("openEditProfileBtn");
    const editModal = document.getElementById("editProfileModal");
    const editForm = document.getElementById("editProfileForm");
    const closeEditBtns = document.querySelectorAll("[data-close-modal='editProfileModal']");

    /* Log Donation Modal Elements */
    const logDonationBtn = document.getElementById("openLogDonationBtn");
    const logModal = document.getElementById("logDonationModal");
    const logForm = document.getElementById("logDonationForm");
    const closeLogBtns = document.querySelectorAll("[data-close-modal='logDonationModal']");

    function renderProfile() {
      const profile = store.getDonorProfile();
      const historyCount = (profile.donationHistory || []).length;

      if (avatarEl) avatarEl.textContent = store.getInitials(profile.name);
      if (nameEl) nameEl.textContent = profile.name;
      if (cityBadgeEl) cityBadgeEl.textContent = profile.city + " • ID: " + profile.id;
      if (bloodGroupEl) bloodGroupEl.textContent = profile.bloodGroup;
      if (compatEl) {
        compatEl.textContent =
          "Can donate to: " + (store.DONATION_COMPATIBILITY[profile.bloodGroup] || profile.bloodGroup);
      }
      if (availToggle) availToggle.checked = Boolean(profile.available);
      if (availBadge) {
        availBadge.className = "badge " + (profile.available ? "badge-available" : "badge-unavailable");
        availBadge.textContent = profile.available ? "Available to Donate" : "Temporarily Unavailable";
      }

      if (emailEl) emailEl.textContent = profile.email;
      if (ageEl) ageEl.textContent = profile.age + " years";
      if (cityEl) cityEl.textContent = profile.city;
      if (addressEl) addressEl.textContent = profile.address;
      if (lastDonationEl) lastDonationEl.textContent = profile.lastDonation || "Not recorded";
      if (totalDonationsEl) totalDonationsEl.textContent = String(historyCount);
      if (livesImpactedEl) livesImpactedEl.textContent = String(historyCount * 3);
    }

    function renderHistory() {
      if (!historyBody) return;
      const profile = store.getDonorProfile();
      const history = profile.donationHistory || [];

      if (!history.length) {
        historyBody.innerHTML =
          '<tr><td colspan="4">No donation records logged yet. Use "Log Donation (Demo)" to add an entry.</td></tr>';
        return;
      }

      historyBody.innerHTML = history
        .map(function (item) {
          return (
            "<tr>" +
              "<td><strong>" + esc(item.date) + "</strong></td>" +
              "<td>" + esc(item.center) + "</td>" +
              "<td>" + esc(item.units) + "</td>" +
              '<td><span class="badge badge-available">' + esc(item.status) + "</span></td>" +
            "</tr>"
          );
        })
        .join("");
    }

    function renderRecentRequests() {
      if (!recentRequestsList) return;
      const profile = store.getDonorProfile();
      const respondedIds = profile.respondedRequestIds || [];
      const requests = store.getRequests().filter(function (req) {
        return req.status !== "Fulfilled";
      });

      if (!requests.length) {
        recentRequestsList.innerHTML =
          '<div class="empty-state"><h3>No active blood requests right now</h3><p>All sample requests have been fulfilled.</p></div>';
        return;
      }

      recentRequestsList.innerHTML = requests
        .slice(0, 6)
        .map(function (req) {
          const priorityClass =
            req.priority === "Critical"
              ? "badge-critical"
              : req.priority === "Urgent"
                ? "badge-urgent"
                : "badge-standard";
          const isMatch = req.bloodGroup === profile.bloodGroup || profile.bloodGroup === "O-";
          const hasResponded = respondedIds.indexOf(req.id) !== -1;

          return (
            '<article class="request-item">' +
              '<div class="request-item-main">' +
                "<h4>" +
                  esc(req.patientName) + " " +
                  '<span class="badge badge-blood">' + esc(req.bloodGroup) + "</span> " +
                  '<span class="badge ' + priorityClass + '">' + esc(req.priority) + "</span>" +
                  (isMatch ? ' <span class="badge badge-available">Blood Match</span>' : "") +
                "</h4>" +
                '<div class="request-item-meta">' +
                  "<span><strong>Hospital:</strong> " + esc(req.hospital) + "</span>" +
                  "<span><strong>City:</strong> " + esc(req.city) + "</span>" +
                  "<span><strong>Units:</strong> " + esc(req.units) + "</span>" +
                  "<span><strong>Date:</strong> " + esc(req.createdAt) + "</span>" +
                "</div>" +
              "</div>" +
              '<div class="request-item-actions">' +
                '<button type="button" class="btn btn-sm ' +
                  (hasResponded ? "btn-success-soft" : "btn-primary") +
                  '" data-action="respond-request" data-request-id="' + esc(req.id) + '"' +
                  (hasResponded ? " disabled" : "") + ">" +
                  (hasResponded ? "Responded (Demo)" : "Offer to Donate") +
                "</button>" +
              "</div>" +
            "</article>"
          );
        })
        .join("");
    }

    /* Availability Toggle Interaction */
    if (availToggle) {
      availToggle.addEventListener("change", function () {
        const nextState = availToggle.checked;
        store.updateDonorProfile({ available: nextState });
        renderProfile();
        if (window.BDFUI && window.BDFUI.showToast) {
          window.BDFUI.showToast(
            nextState
              ? "Status updated: You are now listed as Available."
              : "Status updated: You are now listed as Temporarily Unavailable.",
            "success"
          );
        }
      });
    }

    /* Respond to Blood Request Interaction */
    if (recentRequestsList) {
      recentRequestsList.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-action='respond-request']");
        if (!btn) return;
        const reqId = btn.getAttribute("data-request-id");
        const profile = store.getDonorProfile();
        const responded = (profile.respondedRequestIds || []).slice();
        if (responded.indexOf(reqId) === -1) {
          responded.push(reqId);
          store.updateDonorProfile({ respondedRequestIds: responded });
          store.updateRequest(reqId, { status: "Matched" });
          renderRecentRequests();
          if (window.BDFUI && window.BDFUI.showToast) {
            window.BDFUI.showToast(
              "Demo pledge recorded for " + reqId + ". Request status updated to Matched.",
              "success"
            );
          }
        }
      });
    }

    /* Edit Profile Modal Logic */
    function openEditModal() {
      if (!editModal) return;
      const profile = store.getDonorProfile();
      document.getElementById("editName").value = profile.name;
      document.getElementById("editBloodGroup").value = profile.bloodGroup;
      document.getElementById("editAge").value = profile.age;
      document.getElementById("editCity").value = profile.city;
      document.getElementById("editAddress").value = profile.address;
      document.getElementById("editLastDonation").value =
        /^\d{4}-\d{2}-\d{2}$/.test(profile.lastDonation) ? profile.lastDonation : "";
      editModal.classList.add("is-open");
      editModal.setAttribute("aria-hidden", "false");
    }

    function closeEditModal() {
      if (!editModal) return;
      editModal.classList.remove("is-open");
      editModal.setAttribute("aria-hidden", "true");
    }

    if (editProfileBtn) editProfileBtn.addEventListener("click", openEditModal);
    closeEditBtns.forEach(function (btn) {
      btn.addEventListener("click", closeEditModal);
    });
    if (editModal) {
      editModal.addEventListener("click", function (event) {
        if (event.target === editModal) closeEditModal();
      });
    }

    if (editForm) {
      editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const nameVal = document.getElementById("editName").value.trim();
        const bloodVal = document.getElementById("editBloodGroup").value;
        const ageVal = Number(document.getElementById("editAge").value);
        const cityVal = document.getElementById("editCity").value.trim();
        const addrVal = document.getElementById("editAddress").value.trim();
        const dateVal = document.getElementById("editLastDonation").value;
        const errBox = document.getElementById("editProfileError");

        if (!nameVal || !cityVal || !addrVal || Number.isNaN(ageVal) || ageVal < 18 || ageVal > 65) {
          if (errBox) {
            errBox.textContent = "Please fill all required fields and keep age between 18 and 65.";
            errBox.classList.remove("hidden");
          }
          return;
        }

        if (errBox) errBox.classList.add("hidden");

        store.updateDonorProfile({
          name: nameVal,
          bloodGroup: bloodVal,
          age: ageVal,
          city: cityVal,
          address: addrVal,
          lastDonation: dateVal || "Not recorded"
        });

        renderProfile();
        renderRecentRequests();
        closeEditModal();
        if (window.BDFUI && window.BDFUI.showToast) {
          window.BDFUI.showToast("Donor profile updated in local demo storage.", "success");
        }
      });
    }

    /* Log Demo Donation Modal Logic */
    function openLogModal() {
      if (!logModal) return;
      const dateInput = document.getElementById("logDonationDate");
      if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }
      logModal.classList.add("is-open");
      logModal.setAttribute("aria-hidden", "false");
    }

    function closeLogModal() {
      if (!logModal) return;
      logModal.classList.remove("is-open");
      logModal.setAttribute("aria-hidden", "true");
      if (logForm) logForm.reset();
    }

    if (logDonationBtn) logDonationBtn.addEventListener("click", openLogModal);
    closeLogBtns.forEach(function (btn) {
      btn.addEventListener("click", closeLogModal);
    });
    if (logModal) {
      logModal.addEventListener("click", function (event) {
        if (event.target === logModal) closeLogModal();
      });
    }

    if (logForm) {
      logForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const dateVal = document.getElementById("logDonationDate").value;
        const centerVal = document.getElementById("logDonationCenter").value.trim();
        const unitsVal = document.getElementById("logDonationUnits").value;
        const errBox = document.getElementById("logDonationError");

        if (!dateVal || !centerVal) {
          if (errBox) {
            errBox.textContent = "Please enter the donation date and blood bank / camp name.";
            errBox.classList.remove("hidden");
          }
          return;
        }

        if (errBox) errBox.classList.add("hidden");

        const profile = store.getDonorProfile();
        const history = (profile.donationHistory || []).slice();
        history.unshift({
          date: dateVal,
          center: centerVal,
          units: unitsVal,
          status: "Completed"
        });

        store.updateDonorProfile({
          lastDonation: dateVal,
          donationHistory: history
        });

        renderProfile();
        renderHistory();
        closeLogModal();
        if (window.BDFUI && window.BDFUI.showToast) {
          window.BDFUI.showToast("New demo donation recorded in your history.", "success");
        }
      });
    }

    renderProfile();
    renderHistory();
    renderRecentRequests();
  }

  /* ========================================================================
     2. ADMIN DASHBOARD CONTROLLER (admin-dashboard.html)
     ======================================================================== */
  function initAdminDashboard() {
    const adminRoot = document.getElementById("adminDashboardRoot");
    if (!adminRoot || !window.BDFStore) return;

    const store = window.BDFStore;
    const esc = store.escapeHtml;

    /* KPI Elements */
    const kpiTotalDonors = document.getElementById("kpiTotalDonors");
    const kpiTotalRequests = document.getElementById("kpiTotalRequests");
    const kpiAvailableDonors = document.getElementById("kpiAvailableDonors");
    const kpiEmergencyRequests = document.getElementById("kpiEmergencyRequests");

    /* Donor Table Controls */
    const donorSearch = document.getElementById("adminDonorSearch");
    const donorBloodFilter = document.getElementById("adminDonorBlood");
    const donorAvailFilter = document.getElementById("adminDonorAvail");
    const donorTableBody = document.getElementById("adminDonorsTableBody");
    const donorCountLabel = document.getElementById("adminDonorCount");

    /* Request Table Controls */
    const reqSearch = document.getElementById("adminReqSearch");
    const reqBloodFilter = document.getElementById("adminReqBlood");
    const reqPriorityFilter = document.getElementById("adminReqPriority");
    const reqStatusFilter = document.getElementById("adminReqStatus");
    const reqTableBody = document.getElementById("adminRequestsTableBody");
    const reqCountLabel = document.getElementById("adminReqCount");

    const resetDemoBtn = document.getElementById("resetDemoDataBtn");

    function renderKPIs() {
      const donors = store.getDonors();
      const requests = store.getRequests();
      const availableCount = donors.filter(function (d) { return d.available; }).length;
      const emergencyCount = requests.filter(function (r) {
        return (r.priority === "Critical" || r.priority === "Urgent") && r.status !== "Fulfilled";
      }).length;

      if (kpiTotalDonors) kpiTotalDonors.textContent = String(donors.length);
      if (kpiTotalRequests) kpiTotalRequests.textContent = String(requests.length);
      if (kpiAvailableDonors) kpiAvailableDonors.textContent = String(availableCount);
      if (kpiEmergencyRequests) kpiEmergencyRequests.textContent = String(emergencyCount);
    }

    function renderDonorsTable() {
      if (!donorTableBody) return;
      const donors = store.getDonors();
      const query = donorSearch ? donorSearch.value.trim().toLowerCase() : "";
      const blood = donorBloodFilter ? donorBloodFilter.value : "all";
      const avail = donorAvailFilter ? donorAvailFilter.value : "all";

      const filtered = donors.filter(function (d) {
        const matchQuery =
          !query ||
          d.name.toLowerCase().includes(query) ||
          d.city.toLowerCase().includes(query) ||
          d.id.toLowerCase().includes(query);
        const matchBlood = blood === "all" || d.bloodGroup === blood;
        const matchAvail =
          avail === "all" ||
          (avail === "available" && d.available) ||
          (avail === "unavailable" && !d.available);
        return matchQuery && matchBlood && matchAvail;
      });

      if (donorCountLabel) {
        donorCountLabel.textContent = filtered.length + " of " + donors.length + " records";
      }

      if (!filtered.length) {
        donorTableBody.innerHTML =
          '<tr><td colspan="7">No donor records match the active filters.</td></tr>';
        return;
      }

      donorTableBody.innerHTML = filtered
        .map(function (d) {
          return (
            "<tr>" +
              "<td><strong>" + esc(d.id) + "</strong></td>" +
              "<td>" + esc(d.name) + "</td>" +
              '<td><span class="badge badge-blood">' + esc(d.bloodGroup) + "</span></td>" +
              "<td>" + esc(d.city) + "</td>" +
              "<td>" + esc(d.lastDonation) + "</td>" +
              '<td><span class="badge ' + (d.available ? "badge-available" : "badge-unavailable") + '">' +
                (d.available ? "Available" : "Unavailable") +
              "</span></td>" +
              "<td>" +
                '<div class="table-actions">' +
                  '<button type="button" class="btn btn-outline btn-sm" data-action="toggle-donor" data-id="' + esc(d.id) + '">' +
                    (d.available ? "Mark Unavailable" : "Mark Available") +
                  "</button>" +
                  '<button type="button" class="btn btn-soft btn-sm" data-action="delete-donor" data-id="' + esc(d.id) + '">Remove</button>' +
                "</div>" +
              "</td>" +
            "</tr>"
          );
        })
        .join("");
    }

    function renderRequestsTable() {
      if (!reqTableBody) return;
      const requests = store.getRequests();
      const query = reqSearch ? reqSearch.value.trim().toLowerCase() : "";
      const blood = reqBloodFilter ? reqBloodFilter.value : "all";
      const priority = reqPriorityFilter ? reqPriorityFilter.value : "all";
      const status = reqStatusFilter ? reqStatusFilter.value : "all";

      const filtered = requests.filter(function (r) {
        const matchQuery =
          !query ||
          r.patientName.toLowerCase().includes(query) ||
          r.hospital.toLowerCase().includes(query) ||
          r.city.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query);
        const matchBlood = blood === "all" || r.bloodGroup === blood;
        const matchPriority = priority === "all" || r.priority === priority;
        const matchStatus = status === "all" || r.status === status;
        return matchQuery && matchBlood && matchPriority && matchStatus;
      });

      if (reqCountLabel) {
        reqCountLabel.textContent = filtered.length + " of " + requests.length + " requests";
      }

      if (!filtered.length) {
        reqTableBody.innerHTML =
          '<tr><td colspan="8">No blood requests match the active filters.</td></tr>';
        return;
      }

      reqTableBody.innerHTML = filtered
        .map(function (r) {
          const priorityClass =
            r.priority === "Critical"
              ? "badge-critical"
              : r.priority === "Urgent"
                ? "badge-urgent"
                : "badge-standard";
          const statusClass =
            r.status === "Fulfilled"
              ? "badge-available"
              : r.status === "Matched"
                ? "badge-standard"
                : "badge-urgent";
          const nextStatus =
            r.status === "Pending" ? "Matched" : r.status === "Matched" ? "Fulfilled" : "Pending";

          return (
            "<tr>" +
              "<td><strong>" + esc(r.id) + "</strong></td>" +
              "<td>" + esc(r.patientName) + "</td>" +
              '<td><span class="badge badge-blood">' + esc(r.bloodGroup) + "</span></td>" +
              "<td>" + esc(r.hospital) + ", " + esc(r.city) + "</td>" +
              "<td>" + esc(r.units) + "</td>" +
              '<td><span class="badge ' + priorityClass + '">' + esc(r.priority) + "</span></td>" +
              '<td><span class="badge ' + statusClass + '">' + esc(r.status) + "</span></td>" +
              "<td>" +
                '<div class="table-actions">' +
                  '<button type="button" class="btn btn-outline btn-sm" data-action="cycle-request" data-id="' + esc(r.id) + '" data-next="' + esc(nextStatus) + '">' +
                    "Set " + esc(nextStatus) +
                  "</button>" +
                  '<button type="button" class="btn btn-soft btn-sm" data-action="delete-request" data-id="' + esc(r.id) + '">Remove</button>' +
                "</div>" +
              "</td>" +
            "</tr>"
          );
        })
        .join("");
    }

    function refreshAll() {
      renderKPIs();
      renderDonorsTable();
      renderRequestsTable();
    }

    /* Event Listeners for Filters */
    if (donorSearch) donorSearch.addEventListener("input", renderDonorsTable);
    if (donorBloodFilter) donorBloodFilter.addEventListener("change", renderDonorsTable);
    if (donorAvailFilter) donorAvailFilter.addEventListener("change", renderDonorsTable);

    if (reqSearch) reqSearch.addEventListener("input", renderRequestsTable);
    if (reqBloodFilter) reqBloodFilter.addEventListener("change", renderRequestsTable);
    if (reqPriorityFilter) reqPriorityFilter.addEventListener("change", renderRequestsTable);
    if (reqStatusFilter) reqStatusFilter.addEventListener("change", renderRequestsTable);

    /* Event Delegation for Donor Table Actions */
    if (donorTableBody) {
      donorTableBody.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");

        if (action === "toggle-donor") {
          const donor = store.getDonors().find(function (d) { return d.id === id; });
          if (donor) {
            store.updateDonor(id, { available: !donor.available });
            refreshAll();
            if (window.BDFUI && window.BDFUI.showToast) {
              window.BDFUI.showToast("Updated availability for " + donor.name + ".", "info");
            }
          }
        } else if (action === "delete-donor") {
          store.deleteDonor(id);
          refreshAll();
          if (window.BDFUI && window.BDFUI.showToast) {
            window.BDFUI.showToast("Demo donor " + id + " removed from local storage.", "info");
          }
        }
      });
    }

    /* Event Delegation for Request Table Actions */
    if (reqTableBody) {
      reqTableBody.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");

        if (action === "cycle-request") {
          const next = btn.getAttribute("data-next");
          store.updateRequest(id, { status: next });
          refreshAll();
          if (window.BDFUI && window.BDFUI.showToast) {
            window.BDFUI.showToast("Request " + id + " updated to " + next + ".", "success");
          }
        } else if (action === "delete-request") {
          store.deleteRequest(id);
          refreshAll();
          if (window.BDFUI && window.BDFUI.showToast) {
            window.BDFUI.showToast("Demo request " + id + " removed.", "info");
          }
        }
      });
    }

    /* Reset Demo Sample Data */
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", function () {
        store.resetDemoData();
        if (donorSearch) donorSearch.value = "";
        if (donorBloodFilter) donorBloodFilter.value = "all";
        if (donorAvailFilter) donorAvailFilter.value = "all";
        if (reqSearch) reqSearch.value = "";
        if (reqBloodFilter) reqBloodFilter.value = "all";
        if (reqPriorityFilter) reqPriorityFilter.value = "all";
        if (reqStatusFilter) reqStatusFilter.value = "all";
        refreshAll();
        if (window.BDFUI && window.BDFUI.showToast) {
          window.BDFUI.showToast("Sample fictional data restored.", "success");
        }
      });
    }

    refreshAll();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDonorDashboard();
    initAdminDashboard();
  });
})();
