// ============================================================================
// NUTRITRUTH - CORE APPLICATION LOGIC
// Inspired by TruthIn App & Revant Himatsingka (@foodpharmer)
// Native App Experience • Pure Vanilla JavaScript • GitHub Pages Ready
// ============================================================================

(function () {
  "use strict";

  // Data references from window.NUTRITRUTH_DATA (defined in js/data.js)
  const data = window.NUTRITRUTH_DATA || { products: [], swaps: [], insDictionary: [] };
  const products = data.products;
  const swaps = data.swaps;
  const insDictionary = data.insDictionary;

  // State Management (All stored in LocalStorage - Zero auth/backend required!)
  const state = {
    currentTab: "home",
    selectedCategory: "all",
    searchQuery: "",
    vegOnly: localStorage.getItem("nutritruth_veg_only") === "true",
    activeGoal: localStorage.getItem("nutritruth_active_goal") || "general", // general, diabetes, kids, fitness, weight
    filters: {
      palmOilFree: false,
      zeroAddedSugar: false,
      cleanOnly: false
    },
    compareProductA: "bournvita",
    compareProductB: "clean-sattu",
    bookmarks: JSON.parse(localStorage.getItem("nutritruth_bookmarks") || "[]"),
    streak: parseInt(localStorage.getItem("nutritruth_streak") || "3", 10),
    points: parseInt(localStorage.getItem("nutritruth_points") || "450", 10),
    modalActiveTab: "basic" // "basic" or "matchmeter"
  };

  // DOM Elements Cache
  const views = {
    home: document.getElementById("view-home"),
    scan: document.getElementById("view-scan"),
    compare: document.getElementById("view-compare"),
    swaps: document.getElementById("view-swaps"),
    guide: document.getElementById("view-guide")
  };

  const navLinks = document.querySelectorAll(".nt-nav-link, .nt-tab-btn");
  const productsGrid = document.getElementById("products-grid");
  const searchInput = document.getElementById("global-search-input");
  const categoryChips = document.querySelectorAll(".nt-chip[data-category]");
  const bookmarkCountEl = document.getElementById("bookmark-count-badge");
  const vegToggle = document.getElementById("veg-toggle-btn");
  const streakBadge = document.getElementById("streak-badge-btn");

  // Modal Elements
  const productModal = document.getElementById("product-modal");
  const modalBody = document.getElementById("modal-body-content");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  // Web Audio Context for Scanner Sound (Zero asset dependency)
  function playBeep(success = true) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = success ? "sine" : "sawtooth";
      osc.frequency.setValueAtTime(success ? 880 : 330, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // Audio not permitted
    }
  }

  // Award Points for Healthy Engagement (TruthIn gamification)
  function awardPoints(pts = 10) {
    state.points += pts;
    localStorage.setItem("nutritruth_points", state.points.toString());
    updateStreakUI();
  }

  function updateStreakUI() {
    if (streakBadge) {
      streakBadge.innerHTML = `🔥 ${state.streak} Day Streak • ${state.points} Pts`;
    }
  }

  // ==========================================================================
  // TAB NAVIGATION & SPA ROUTER
  // ==========================================================================
  function switchTab(targetTabId) {
    if (!views[targetTabId]) return;

    state.currentTab = targetTabId;

    // Toggle active view
    Object.keys(views).forEach((key) => {
      if (views[key]) {
        views[key].classList.toggle("active-view", key === targetTabId);
      }
    });

    // Update active nav links
    navLinks.forEach((link) => {
      const linkTab = link.getAttribute("data-tab");
      link.classList.toggle("active", linkTab === targetTabId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Tab-specific initializations
    if (targetTabId === "compare") {
      renderComparisonArena();
    } else if (targetTabId === "swaps") {
      renderSwapsTable();
    } else if (targetTabId === "guide") {
      renderInsDictionary();
    }
  }

  // Bind tab buttons
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-tab");
      switchTab(target);
    });
  });

  // Action links with data-navigate
  document.querySelectorAll("[data-navigate]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = el.getAttribute("data-navigate");
      switchTab(target);
    });
  });

  // Veg Only Toggle Handler
  if (vegToggle) {
    vegToggle.classList.toggle("active", state.vegOnly);
    vegToggle.addEventListener("click", () => {
      state.vegOnly = !state.vegOnly;
      localStorage.setItem("nutritruth_veg_only", state.vegOnly.toString());
      vegToggle.classList.toggle("active", state.vegOnly);
      renderProductCards();
    });
  }

  // MatchMeter Health Goals Selector
  document.querySelectorAll(".goal-pill").forEach((pill) => {
    const goal = pill.getAttribute("data-goal");
    pill.classList.toggle("active", goal === state.activeGoal);
    pill.addEventListener("click", () => {
      document.querySelectorAll(".goal-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.activeGoal = goal;
      localStorage.setItem("nutritruth_active_goal", goal);
      renderProductCards();
    });
  });

  // ==========================================================================
  // PRODUCT RENDERING (HOME & EXPLORE)
  // ==========================================================================
  function getScoreClass(score) {
    if (score >= 80) return "score-clean";
    if (score >= 50) return "score-caution";
    return "score-avoid";
  }

  function getScoreBadge(score) {
    if (score >= 80) return '<span class="nt-badge badge-clean">🟢 Clean Label</span>';
    if (score >= 50) return '<span class="nt-badge badge-caution">🟡 Moderate</span>';
    return '<span class="nt-badge badge-avoid">🔴 Ultra-Processed</span>';
  }

  function renderSugarCubes(count) {
    let cubesHtml = "";
    const intCount = Math.min(Math.round(count), 10);
    for (let i = 0; i < intCount; i++) {
      cubesHtml += '<span class="cube-icon" title="1 Sugar Cube = 4g"></span>';
    }
    return cubesHtml;
  }

  function filterProducts() {
    return products.filter((p) => {
      // Veg Only Check
      if (state.vegOnly && !p.isVeg) return false;

      // Category Filter
      if (state.selectedCategory !== "all" && p.category !== state.selectedCategory) {
        return false;
      }

      // Search Query
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchIng = p.ingredientsList.toLowerCase().includes(q);
        const matchClaims = p.frontClaims.some((c) => c.claim.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchIng && !matchClaims) return false;
      }

      // Specific Concern Filters
      if (state.filters.palmOilFree && p.palmOil) return false;
      if (state.filters.zeroAddedSugar && p.nutritionPer100g.addedSugars > 0) return false;
      if (state.filters.cleanOnly && p.truthScore < 80) return false;

      return true;
    });
  }

  function renderProductCards() {
    if (!productsGrid) return;

    const filtered = filterProducts();

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #ffffff; border-radius: 20px; border: 1.5px dashed var(--color-border);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--color-forest);">No food products match this filter</h3>
          <p style="color: var(--color-text-muted); margin-top: 6px;">Try adjusting your search terms, turning off Veg-only, or resetting filters.</p>
          <button class="nt-btn nt-btn-outline" style="margin-top: 16px;" id="reset-filters-btn">Clear All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.searchQuery = "";
          state.selectedCategory = "all";
          state.vegOnly = false;
          state.filters.palmOilFree = false;
          state.filters.zeroAddedSugar = false;
          state.filters.cleanOnly = false;
          if (searchInput) searchInput.value = "";
          if (vegToggle) vegToggle.classList.remove("active");
          document.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("active"));
          categoryChips.forEach((c) => c.classList.toggle("active", c.getAttribute("data-category") === "all"));
          renderProductCards();
        });
      }
      return;
    }

    productsGrid.innerHTML = filtered
      .map((p) => {
        const isBookmarked = state.bookmarks.includes(p.id);
        const palmBadge = p.palmOil
          ? '<span class="nt-badge badge-palm-alert">🚨 Palmolein Oil</span>'
          : '<span class="nt-badge badge-palm-free">✅ Palm-Oil Free</span>';

        const sugarStripClass = p.sugarGramsPer100g > 15 ? "" : "clean-sugar";

        // MatchMeter Custom Rating based on active health goal
        const goalData = p.matchRatings ? p.matchRatings[state.activeGoal] || p.matchRatings.general : null;
        let matchBannerHtml = "";
        if (goalData) {
          const matchClass = goalData.status === "clean" ? "match-clean" : goalData.status === "avoid" ? "match-avoid" : "match-caution";
          matchBannerHtml = `
            <div class="card-match-banner ${matchClass}">
              <span>🎯 ${goalData.score}% Match:</span>
              <span>${goalData.note}</span>
            </div>
          `;
        }

        return `
        <article class="nt-product-card" data-product-id="${p.id}">
          <div class="card-img-wrap">
            <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy" />
            <div class="card-score-pill ${getScoreClass(p.truthScore)}" title="NutriTruth Score: ${p.truthScore}/100">
              ${p.truthScore}
            </div>
          </div>
          <div class="card-content">
            <div class="card-brand-row">
              <div style="display: flex; align-items: center; gap: 6px;">
                ${p.isVeg ? '<span class="badge-veg" title="Vegetarian Product"></span>' : ''}
                <span class="card-brand">${p.brand}</span>
              </div>
              <button class="bookmark-btn" data-id="${p.id}" title="${isBookmarked ? 'Remove Bookmark' : 'Save Product'}" style="color: ${isBookmarked ? '#f59e0b' : '#94a3b8'};">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
            
            <h3 class="card-title">${p.name}</h3>
            
            <div class="card-tags">
              ${getScoreBadge(p.truthScore)}
              ${palmBadge}
            </div>

            <!-- MatchMeter Tailored Rating -->
            ${matchBannerHtml}

            <!-- Sugar Cubes Counter -->
            <div class="sugar-cubes-strip ${sugarStripClass}">
              <span>${p.sugarGramsPer100g}g Sugar / 100g</span>
              <div style="display: flex; gap: 3px; margin-left: auto;">
                ${renderSugarCubes(p.sugarCubesPerServing)}
              </div>
            </div>

            <p class="card-reality">
              <strong>Reality Check:</strong> ${p.realityCheck}
            </p>

            <div class="card-footer">
              <button class="nt-btn nt-btn-outline nt-btn-sm inspect-btn" data-id="${p.id}">
                🔍 Inspect Label
              </button>
              <button class="nt-btn nt-btn-primary nt-btn-sm compare-action-btn" data-id="${p.id}">
                ⚖️ Compare
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    // Bind inspect, compare, and bookmark triggers
    document.querySelectorAll(".inspect-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-id");
        awardPoints(5);
        openProductModal(pid);
      });
    });

    document.querySelectorAll(".compare-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-id");
        launchComparison(pid);
      });
    });

    document.querySelectorAll(".bookmark-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pid = btn.getAttribute("data-id");
        toggleBookmark(pid);
      });
    });
  }

  // Category filter clicks
  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      categoryChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.selectedCategory = chip.getAttribute("data-category");
      renderProductCards();
    });
  });

  // Search input live filtering
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProductCards();
    });
  }

  // Quick Concern Toggles
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterKey = btn.getAttribute("data-filter");
      btn.classList.toggle("active");
      state.filters[filterKey] = btn.classList.contains("active");
      renderProductCards();
    });
  });

  // Bookmarking System
  function toggleBookmark(productId) {
    const idx = state.bookmarks.indexOf(productId);
    if (idx === -1) {
      state.bookmarks.push(productId);
      awardPoints(15);
    } else {
      state.bookmarks.splice(idx, 1);
    }
    localStorage.setItem("nutritruth_bookmarks", JSON.stringify(state.bookmarks));
    updateBookmarkBadge();
    renderProductCards();
  }

  function updateBookmarkBadge() {
    if (bookmarkCountEl) {
      bookmarkCountEl.textContent = state.bookmarks.length;
      bookmarkCountEl.style.display = state.bookmarks.length > 0 ? "inline-flex" : "none";
    }
  }

  // ==========================================================================
  // PRODUCT DETAIL MODAL (BASIC INFO + MATCHMETER PLUS TABS)
  // ==========================================================================
  function openProductModal(productId) {
    const p = products.find((item) => item.id === productId);
    if (!p || !productModal || !modalBody) return;

    state.modalActiveTab = "basic";

    renderModalContent(p);
    productModal.classList.add("open");
  }

  function renderModalContent(p) {
    const palmClass = p.palmOil ? "badge-palm-alert" : "badge-palm-free";
    const palmText = p.palmOil ? "🚨 Contains Palm Oil / Palmolein" : "✅ 100% Palm Oil Free";
    const goalData = p.matchRatings ? p.matchRatings[state.activeGoal] || p.matchRatings.general : null;

    modalBody.innerHTML = `
      <div style="display: grid; gap: 20px;">
        <!-- Top Info Header -->
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <img src="${p.image}" alt="${p.name}" style="width: 88px; height: 88px; object-fit: contain; border-radius: 12px; background: #f8faf8; padding: 6px; border: 1px solid var(--color-border);" />
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 6px;">
              ${p.isVeg ? '<span class="badge-veg" title="Vegetarian"></span>' : ''}
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--color-text-light);">${p.brand}</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 900; color: var(--color-forest); line-height: 1.2; margin-top: 2px;">${p.name}</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              ${getScoreBadge(p.truthScore)}
              <span class="nt-badge ${palmClass}">${palmText}</span>
              <span class="nt-badge" style="background: #f1f5f9; color: #475569;">NOVA ${p.novaClass || 4}</span>
            </div>
          </div>
          <div style="text-align: center; background: #f1f5f1; padding: 10px 16px; border-radius: 14px;">
            <div style="font-size: 2rem; font-weight: 900; line-height: 1; color: ${p.truthScore >= 80 ? '#15803d' : p.truthScore >= 50 ? '#ca8a04' : '#dc2626'};">${p.truthScore}</div>
            <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--color-text-muted); margin-top: 4px;">Truth Score</div>
          </div>
        </div>

        <!-- Segmented Control Tabs (TruthIn Native Screen 2 & 3) -->
        <div class="segmented-control">
          <button class="segment-btn ${state.modalActiveTab === 'basic' ? 'active' : ''}" id="modal-tab-basic">
            📋 Basic Back Label Info
          </button>
          <button class="segment-btn ${state.modalActiveTab === 'matchmeter' ? 'active' : ''}" id="modal-tab-matchmeter">
            🎯 MatchMeter For You
          </button>
        </div>

        <!-- TAB CONTENT: BASIC INFO -->
        <div id="tab-pane-basic" style="display: ${state.modalActiveTab === 'basic' ? 'grid' : 'none'}; gap: 18px;">
          <!-- Palm Oil & Sugar Highlights -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            <div style="background: ${p.palmOil ? '#fef2f2' : '#f0fdf4'}; border: 1.5px solid ${p.palmOil ? '#fecaca' : '#bbf7d0'}; border-radius: 14px; padding: 14px;">
              <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: ${p.palmOil ? '#991b1b' : '#166534'};">Fat / Shortening Formulation</div>
              <p style="font-size: 0.9rem; font-weight: 700; margin-top: 4px; color: ${p.palmOil ? '#7f1d1d' : '#14532d'};">
                ${p.palmOilDetails}
              </p>
            </div>
            <div style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 14px; padding: 14px;">
              <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #854d0e;">Sugar Payload</div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #713f12; margin-top: 2px;">
                ${p.sugarGramsPer100g}g <span style="font-size: 0.8rem; font-weight: 600;">per 100g</span>
              </div>
              <div style="display: flex; gap: 4px; align-items: center; margin-top: 6px;">
                ${renderSugarCubes(p.sugarCubesPerServing)}
                <span style="font-size: 0.76rem; font-weight: 700; color: #854d0e; margin-left: 6px;">(~${p.sugarCubesPerServing} cubes / serving)</span>
              </div>
            </div>
          </div>

          <!-- Marketing Claims Debunked -->
          <div style="background: #ffffff; border: 1.5px solid var(--color-border); border-radius: 14px; padding: 16px;">
            <h4 style="font-size: 0.98rem; font-weight: 800; color: var(--color-forest);">
              📢 Front Pack Claims vs Back Label Truth
            </h4>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
              ${p.frontClaims
                .map(
                  (c) => `
                <div style="border-left: 4px solid #f59e0b; background: #fffbeb; padding: 10px 14px; border-radius: 0 10px 10px 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #78350f; font-size: 0.88rem;">"${c.claim}"</strong>
                    <span class="nt-badge" style="background: #fef3c7; color: #92400e; font-size: 0.7rem;">${c.verdict}</span>
                  </div>
                  <p style="font-size: 0.82rem; color: #92400e; margin-top: 4px;">${c.explanation}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <!-- Back Ingredients Decoded -->
          <div style="background: #ffffff; border: 1.5px solid var(--color-border); border-radius: 14px; padding: 16px;">
            <h4 style="font-size: 0.98rem; font-weight: 800; color: var(--color-forest);">
              🧾 Back Ingredients Decoded
            </h4>
            <p style="font-size: 0.86rem; color: var(--color-text-main); background: #f8faf8; padding: 12px; border-radius: 10px; margin-top: 10px; line-height: 1.5; border: 1px solid var(--color-border-subtle);">
              ${p.ingredientsList}
            </p>

            ${
              p.flaggedIngredients && p.flaggedIngredients.length > 0
                ? `
              <div style="margin-top: 12px;">
                <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: #b91c1c;">Flagged Problematic Additives:</span>
                <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
                  ${p.flaggedIngredients
                    .map(
                      (f) => `
                    <div style="display: flex; gap: 8px; font-size: 0.84rem; background: #fef2f2; padding: 8px 12px; border-radius: 8px; border: 1px solid #fee2e2;">
                      <span style="color: #dc2626; font-weight: 900;">⚠️</span>
                      <div>
                        <strong style="color: #991b1b;">${f.name}:</strong> 
                        <span style="color: #7f1d1d;">${f.reason}</span>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : `
              <div style="margin-top: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 8px; color: #166534; font-size: 0.85rem; font-weight: 700;">
                ✅ Clean Formulation: Zero controversial synthetic additives or palm fats detected.
              </div>
            `
            }
          </div>

          <!-- Nutrition Facts Table -->
          <div style="background: #ffffff; border: 1.5px solid var(--color-border); border-radius: 14px; padding: 16px;">
            <h4 style="font-size: 0.98rem; font-weight: 800; color: var(--color-forest);">
              📊 Nutrition Facts (Per 100g)
            </h4>
            <div class="nt-table-wrap" style="margin-top: 8px;">
              <table class="nt-table">
                <thead>
                  <tr>
                    <th>Calories</th>
                    <th>Carbs</th>
                    <th>Sugar</th>
                    <th>Added Sugar</th>
                    <th>Protein</th>
                    <th>Fat</th>
                    <th>Sat Fat</th>
                    <th>Sodium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${p.nutritionPer100g.calories} kcal</strong></td>
                    <td>${p.nutritionPer100g.carbs}g</td>
                    <td><strong style="color: ${p.nutritionPer100g.totalSugars > 15 ? '#dc2626' : 'inherit'};">${p.nutritionPer100g.totalSugars}g</strong></td>
                    <td>${p.nutritionPer100g.addedSugars}g</td>
                    <td>${p.nutritionPer100g.protein}g</td>
                    <td>${p.nutritionPer100g.fat}g</td>
                    <td>${p.nutritionPer100g.saturatedFat}g</td>
                    <td>${p.nutritionPer100g.sodium}mg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB CONTENT: MATCHMETER (PLUS FOR YOU) -->
        <div id="tab-pane-matchmeter" style="display: ${state.modalActiveTab === 'matchmeter' ? 'grid' : 'none'}; gap: 16px;">
          <!-- MatchMeter Personalized Rating Header -->
          <div style="background: ${goalData && goalData.status === 'clean' ? '#f0fdf4' : '#fef2f2'}; border: 2px solid ${goalData && goalData.status === 'clean' ? '#86efac' : '#fca5a5'}; border-radius: 16px; padding: 18px; text-align: center;">
            <span class="nt-badge" style="background: rgba(0,0,0,0.06); color: inherit;">
              🎯 Active Health Goal: ${state.activeGoal.toUpperCase()}
            </span>
            <div style="font-size: 2.8rem; font-weight: 900; color: ${goalData && goalData.status === 'clean' ? '#15803d' : '#dc2626'}; margin-top: 6px;">
              ${goalData ? goalData.score : p.truthScore}% Match
            </div>
            <p style="font-size: 0.94rem; font-weight: 800; color: ${goalData && goalData.status === 'clean' ? '#14532d' : '#7f1d1d'}; max-width: 50ch; margin: 4px auto 0;">
              ${goalData ? goalData.note : p.realityCheck}
            </p>
          </div>

          <!-- Allergen & Sensitivity Checklist -->
          <div style="background: #ffffff; border: 1.5px solid var(--color-border); border-radius: 14px; padding: 16px;">
            <h4 style="font-size: 0.98rem; font-weight: 800; color: var(--color-forest);">
              🛡️ Allergen & Ingredient Sensitivities
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
              ${
                p.allergens && p.allergens.length > 0
                  ? p.allergens.map((a) => `<span class="nt-badge" style="background: #fff1f2; color: #be123c; border: 1px solid #fecdd3;">⚠️ Contains: ${a}</span>`).join("")
                  : '<span class="nt-badge badge-clean">✅ No Major Common Allergens</span>'
              }
            </div>
          </div>

          <!-- Health Goal Suitability Matrix -->
          <div style="background: #ffffff; border: 1.5px solid var(--color-border); border-radius: 14px; padding: 16px;">
            <h4 style="font-size: 0.98rem; font-weight: 800; color: var(--color-forest);">
              🩺 Suitability Across Life Stages
            </h4>
            <div style="display: grid; gap: 8px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8faf8; border-radius: 8px;">
                <span style="font-size: 0.86rem; font-weight: 700;">🩸 Diabetes & Sugar Watch</span>
                <span class="nt-badge ${p.sugarGramsPer100g > 15 ? 'badge-avoid' : 'badge-clean'}">${p.sugarGramsPer100g > 15 ? 'High Sugar Hazard' : 'Safe Sugar Level'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8faf8; border-radius: 8px;">
                <span style="font-size: 0.86rem; font-weight: 700;">👶 Kids Nutrition & Safety</span>
                <span class="nt-badge ${p.palmOil ? 'badge-avoid' : 'badge-clean'}">${p.palmOil ? 'Palm Oil Present' : 'Zero Palm Oil'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8faf8; border-radius: 8px;">
                <span style="font-size: 0.86rem; font-weight: 700;">🏃 Fitness & Lean Muscle</span>
                <span class="nt-badge ${p.nutritionPer100g.protein >= 15 ? 'badge-clean' : 'badge-caution'}">${p.nutritionPer100g.protein}g Protein</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Clean Swap Suggestion Card -->
        ${
          p.cleanAlternativeId
            ? `
          <div style="background: #ecfdf5; border: 2px solid #6ee7b7; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="nt-badge badge-clean">💡 FoodPharmer's Clean Alternative</span>
              <button class="nt-btn nt-btn-primary nt-btn-sm" id="modal-swap-compare-btn" data-swap-id="${p.cleanAlternativeId}">
                Compare Side-by-Side ⚖️
              </button>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #064e3b;">
              Swap with: ${p.cleanAlternativeName}
            </h4>
            <p style="font-size: 0.88rem; font-weight: 700; color: #047857;">
              Health Benefits: ${p.cleanAlternativeSavings}
            </p>
          </div>
        `
            : ""
        }
      </div>
    `;

    // Segment tab toggles
    const tabBasic = document.getElementById("modal-tab-basic");
    const tabMatch = document.getElementById("modal-tab-matchmeter");

    if (tabBasic && tabMatch) {
      tabBasic.addEventListener("click", () => {
        state.modalActiveTab = "basic";
        renderModalContent(p);
      });
      tabMatch.addEventListener("click", () => {
        state.modalActiveTab = "matchmeter";
        renderModalContent(p);
      });
    }

    // Modal swap compare trigger
    const swapBtn = document.getElementById("modal-swap-compare-btn");
    if (swapBtn) {
      swapBtn.addEventListener("click", () => {
        const altId = swapBtn.getAttribute("data-swap-id");
        productModal.classList.remove("open");
        state.compareProductA = p.id;
        state.compareProductB = altId;
        switchTab("compare");
      });
    }
  }

  // Close modal bindings
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      productModal.classList.remove("open");
    });
  }

  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) {
        productModal.classList.remove("open");
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && productModal && productModal.classList.contains("open")) {
      productModal.classList.remove("open");
    }
  });

  // ==========================================================================
  // HEAD-TO-HEAD COMPARISON TOOL
  // ==========================================================================
  function launchComparison(productId) {
    const p = products.find((x) => x.id === productId);
    if (!p) return;

    state.compareProductA = productId;
    if (p.cleanAlternativeId && products.find((x) => x.id === p.cleanAlternativeId)) {
      state.compareProductB = p.cleanAlternativeId;
    } else {
      const other = products.find((x) => x.id !== productId && x.category === p.category) || products[0];
      state.compareProductB = other.id;
    }

    awardPoints(10);
    switchTab("compare");
  }

  function renderComparisonArena() {
    const arenaEl = document.getElementById("comparison-arena-mount");
    const selectA = document.getElementById("compare-select-a");
    const selectB = document.getElementById("compare-select-b");

    if (!arenaEl || !selectA || !selectB) return;

    // Populate dropdowns if empty
    if (selectA.options.length <= 1) {
      selectA.innerHTML = products.map((p) => `<option value="${p.id}">${p.name} (${p.brand})</option>`).join("");
      selectB.innerHTML = products.map((p) => `<option value="${p.id}">${p.name} (${p.brand})</option>`).join("");
    }

    selectA.value = state.compareProductA;
    selectB.value = state.compareProductB;

    const prodA = products.find((p) => p.id === state.compareProductA) || products[0];
    const prodB = products.find((p) => p.id === state.compareProductB) || products[1];

    const sugarDelta = (prodA.nutritionPer100g.totalSugars - prodB.nutritionPer100g.totalSugars).toFixed(1);
    const proteinDelta = (prodB.nutritionPer100g.protein - prodA.nutritionPer100g.protein).toFixed(1);

    arenaEl.innerHTML = `
      <div class="compare-arena">
        <!-- Product A -->
        <div class="compare-column ${prodA.truthScore >= 80 ? 'compare-col-good' : 'compare-col-bad'}">
          <div class="compare-hero-block">
            <img src="${prodA.image}" alt="${prodA.name}" class="compare-img" />
            <div>
              <span class="card-brand">${prodA.brand}</span>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-forest);">${prodA.name}</h3>
              <div style="margin-top: 4px;">
                ${getScoreBadge(prodA.truthScore)}
              </div>
            </div>
            <div style="margin-left: auto; text-align: center;">
              <div class="card-score-pill ${getScoreClass(prodA.truthScore)}" style="position: static; width: 48px; height: 48px; font-size: 1.2rem;">
                ${prodA.truthScore}
              </div>
            </div>
          </div>

          <div style="margin-top: 14px; padding: 10px; border-radius: 8px; background: ${prodA.palmOil ? '#fee2e2' : '#e0f2fe'}; font-size: 0.84rem; font-weight: 800; color: ${prodA.palmOil ? '#991b1b' : '#0369a1'};">
            ${prodA.palmOil ? '❌ Palm Oil Present (Palmolein Fat)' : '✅ 100% Palm-Oil Free'}
          </div>

          <div class="visual-sugar-box">
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.82rem;">
              <span>Sugar: ${prodA.sugarGramsPer100g}g / 100g</span>
              <span style="color: #991b1b;">${prodA.sugarCubesPerServing} Cubes / Serving</span>
            </div>
            <div class="cubes-display-pile">
              ${renderComparisonSugarVisuals(prodA.sugarCubesPerServing)}
            </div>
          </div>

          <div style="margin-top: 14px;">
            <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: var(--color-text-muted);">Back Formulation Summary:</span>
            <p style="font-size: 0.84rem; color: var(--color-text-main); margin-top: 4px; line-height: 1.5; background: #f8faf8; padding: 10px; border-radius: 8px;">
              ${prodA.realityCheck}
            </p>
          </div>
        </div>

        <!-- Product B -->
        <div class="compare-column ${prodB.truthScore >= 80 ? 'compare-col-good' : 'compare-col-bad'}">
          <div class="compare-hero-block">
            <img src="${prodB.image}" alt="${prodB.name}" class="compare-img" />
            <div>
              <span class="card-brand">${prodB.brand}</span>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-forest);">${prodB.name}</h3>
              <div style="margin-top: 4px;">
                ${getScoreBadge(prodB.truthScore)}
              </div>
            </div>
            <div style="margin-left: auto; text-align: center;">
              <div class="card-score-pill ${getScoreClass(prodB.truthScore)}" style="position: static; width: 48px; height: 48px; font-size: 1.2rem;">
                ${prodB.truthScore}
              </div>
            </div>
          </div>

          <div style="margin-top: 14px; padding: 10px; border-radius: 8px; background: ${prodB.palmOil ? '#fee2e2' : '#e0f2fe'}; font-size: 0.84rem; font-weight: 800; color: ${prodB.palmOil ? '#991b1b' : '#0369a1'};">
            ${prodB.palmOil ? '❌ Palm Oil Present (Palmolein Fat)' : '✅ 100% Palm-Oil Free'}
          </div>

          <div class="visual-sugar-box">
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.82rem;">
              <span>Sugar: ${prodB.sugarGramsPer100g}g / 100g</span>
              <span style="color: #991b1b;">${prodB.sugarCubesPerServing} Cubes / Serving</span>
            </div>
            <div class="cubes-display-pile">
              ${renderComparisonSugarVisuals(prodB.sugarCubesPerServing)}
            </div>
          </div>

          <div style="margin-top: 14px;">
            <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: var(--color-text-muted);">Back Formulation Summary:</span>
            <p style="font-size: 0.84rem; color: var(--color-text-main); margin-top: 4px; line-height: 1.5; background: #f8faf8; padding: 10px; border-radius: 8px;">
              ${prodB.realityCheck}
            </p>
          </div>
        </div>
      </div>

      <!-- Verdict Summary Box -->
      <div class="compare-verdict-box">
        <div class="compare-verdict-title">
          <span>⚖️</span> TruthIn Final Verdict: Why This Matters
        </div>
        <p class="compare-verdict-text">
          ${generateVerdictText(prodA, prodB, sugarDelta, proteinDelta)}
        </p>
      </div>

      <!-- Nutrient Comparison Table -->
      <div class="nt-table-wrap">
        <table class="nt-table">
          <thead>
            <tr>
              <th>Nutrition metric (per 100g)</th>
              <th>${prodA.name}</th>
              <th>${prodB.name}</th>
              <th>Health Advantage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>NutriTruth Score</strong></td>
              <td><strong style="color: ${prodA.truthScore >= 80 ? '#15803d' : '#dc2626'};">${prodA.truthScore} / 100</strong></td>
              <td><strong style="color: ${prodB.truthScore >= 80 ? '#15803d' : '#dc2626'};">${prodB.truthScore} / 100</strong></td>
              <td><strong>${prodB.truthScore > prodA.truthScore ? `+${prodB.truthScore - prodA.truthScore} pts higher` : `${prodA.truthScore - prodB.truthScore} pts higher`}</strong></td>
            </tr>
            <tr>
              <td><strong>Total Sugar</strong></td>
              <td>${prodA.nutritionPer100g.totalSugars}g</td>
              <td>${prodB.nutritionPer100g.totalSugars}g</td>
              <td><span style="color: #15803d; font-weight: 800;">${Math.abs(sugarDelta)}g less sugar</span></td>
            </tr>
            <tr>
              <td><strong>Palm Oil / Palmolein</strong></td>
              <td>${prodA.palmOil ? '❌ Yes (Palmolein)' : '✅ None'}</td>
              <td>${prodB.palmOil ? '❌ Yes (Palmolein)' : '✅ None'}</td>
              <td><strong>${prodA.palmOil && !prodB.palmOil ? 'Clean Fats Winner' : 'Identical Fat Source'}</strong></td>
            </tr>
            <tr>
              <td><strong>Protein</strong></td>
              <td>${prodA.nutritionPer100g.protein}g</td>
              <td>${prodB.nutritionPer100g.protein}g</td>
              <td><span style="color: #15803d; font-weight: 800;">${Math.abs(proteinDelta)}g difference</span></td>
            </tr>
            <tr>
              <td><strong>Saturated Fat</strong></td>
              <td>${prodA.nutritionPer100g.saturatedFat}g</td>
              <td>${prodB.nutritionPer100g.saturatedFat}g</td>
              <td>${prodA.nutritionPer100g.saturatedFat > prodB.nutritionPer100g.saturatedFat ? 'Lower Bad Fat' : 'Similar Fat'}</td>
            </tr>
            <tr>
              <td><strong>Sodium</strong></td>
              <td>${prodA.nutritionPer100g.sodium}mg</td>
              <td>${prodB.nutritionPer100g.sodium}mg</td>
              <td>${Math.abs(prodA.nutritionPer100g.sodium - prodB.nutritionPer100g.sodium)}mg sodium delta</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function renderComparisonSugarVisuals(count) {
    let html = "";
    const intCount = Math.min(Math.round(count * 2) / 2, 12);
    if (intCount <= 0.2) {
      return '<span style="font-size: 0.8rem; color: #166534; font-weight: 700;">🌱 Zero Added Sugar Cubes</span>';
    }
    for (let i = 0; i < Math.floor(intCount); i++) {
      html += '<div class="sugar-cube-visual">🧊</div>';
    }
    return html;
  }

  function generateVerdictText(pA, pB, sugarDelta, proteinDelta) {
    if (pB.truthScore > pA.truthScore) {
      return `By switching from <strong>${pA.name}</strong> to <strong>${pB.name}</strong>, you eliminate <strong>${Math.abs(sugarDelta)}g of sugar per 100g</strong> and eliminate refined palm oil and synthetic preservatives. As Revant Himatsingka (@foodpharmer) advocates in 'Label Padhega India', making this single daily switch prevents insulin resistance and removes hidden industrial additives.`;
    } else if (pA.truthScore > pB.truthScore) {
      return `<strong>${pA.name}</strong> has a significantly cleaner formulation than <strong>${pB.name}</strong>. It contains fewer deceptive sugars and maintains superior whole-food integrity.`;
    }
    return `Both products have comparable nutritional values. Always inspect the first 3 ingredients on the physical label before purchasing.`;
  }

  // Dropdown change listeners
  const selectA = document.getElementById("compare-select-a");
  const selectB = document.getElementById("compare-select-b");

  if (selectA) {
    selectA.addEventListener("change", (e) => {
      state.compareProductA = e.target.value;
      renderComparisonArena();
    });
  }

  if (selectB) {
    selectB.addEventListener("change", (e) => {
      state.compareProductB = e.target.value;
      renderComparisonArena();
    });
  }

  // Preset comparison buttons
  document.querySelectorAll(".preset-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      state.compareProductA = pill.getAttribute("data-p1");
      state.compareProductB = pill.getAttribute("data-p2");
      renderComparisonArena();
    });
  });

  // ==========================================================================
  // SMART FOOD SWAPS & SUGGESTIONS TABLE VIEW
  // ==========================================================================
  function renderSwapsTable() {
    const tableMount = document.getElementById("swaps-table-mount");
    if (!tableMount) return;

    tableMount.innerHTML = `
      <div class="swaps-table-card">
        ${swaps
          .map(
            (s) => `
          <div class="swaps-row">
            <div>
              <div class="swap-item-info">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: grid; place-items: center; font-weight: 900; font-size: 0.9rem; flex-shrink: 0;">
                  ${s.badProduct.score}
                </div>
                <div>
                  <h4 style="font-size: 0.96rem; font-weight: 800; color: #991b1b;">${s.badProduct.name}</h4>
                  <span style="font-size: 0.74rem; color: var(--color-text-light); text-transform: uppercase; font-weight: 700;">${s.badProduct.brand}</span>
                  <div style="font-size: 0.78rem; color: #7f1d1d; margin-top: 4px;">⚠️ ${s.badProduct.concerns}</div>
                </div>
              </div>
            </div>

            <div>
              <div class="swap-item-info">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: #dcfce7; color: #15803d; display: grid; place-items: center; font-weight: 900; font-size: 0.9rem; flex-shrink: 0;">
                  ${s.goodProduct.score}
                </div>
                <div>
                  <h4 style="font-size: 0.96rem; font-weight: 800; color: #166534;">${s.goodProduct.name}</h4>
                  <span style="font-size: 0.74rem; color: var(--color-text-light); text-transform: uppercase; font-weight: 700;">${s.goodProduct.brand}</span>
                  <div style="font-size: 0.78rem; color: #14532d; margin-top: 4px;">✅ ${s.goodProduct.benefits}</div>
                </div>
              </div>
            </div>

            <div>
              <div class="nt-badge badge-clean" style="font-size: 0.8rem;">
                ${s.sugarReduction}
              </div>
              <p style="font-size: 0.76rem; color: var(--color-text-muted); margin-top: 4px;">
                ${s.swapVerdict}
              </p>
            </div>

            <div>
              <button class="nt-btn nt-btn-outline nt-btn-sm swap-compare-trigger" data-swap-id="${s.id}">
                ⚖️ Compare
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.querySelectorAll(".swap-compare-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const swapId = btn.getAttribute("data-swap-id");
        const swapObj = swaps.find((s) => s.id === swapId);
        if (!swapObj) return;

        const pA = products.find((p) => p.name.toLowerCase().includes(swapObj.badProduct.name.toLowerCase().split(" ")[0])) || products[0];
        const pB = products.find((p) => p.name.toLowerCase().includes(swapObj.goodProduct.name.toLowerCase().split(" ")[0])) || products[1];

        state.compareProductA = pA.id;
        state.compareProductB = pB.id;
        awardPoints(10);
        switchTab("compare");
      });
    });
  }

  // ==========================================================================
  // SCANNER & OCR INGREDIENT TEXT ANALYZER
  // ==========================================================================
  const scanInputText = document.getElementById("scan-input-text");
  const analyzeBtn = document.getElementById("analyze-text-btn");
  const scanResultMount = document.getElementById("scan-result-mount");

  document.querySelectorAll(".sample-barcode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-scan-id");
      playBeep(true);

      const laser = document.querySelector(".laser-scanner-line");
      if (laser) {
        laser.style.background = "#38bdf8";
        setTimeout(() => {
          laser.style.background = "#22c55e";
        }, 300);
      }

      const p = products.find((x) => x.id === targetId);
      if (p) {
        if (scanInputText) scanInputText.value = p.ingredientsList;
        awardPoints(20);
        runIngredientAnalysis(p.ingredientsList, p.name);
      }
    });
  });

  if (analyzeBtn && scanInputText) {
    analyzeBtn.addEventListener("click", () => {
      const text = scanInputText.value.trim();
      if (!text) {
        alert("Please paste or type an ingredients list first!");
        return;
      }
      playBeep(true);
      awardPoints(20);
      runIngredientAnalysis(text);
    });
  }

  function runIngredientAnalysis(ingredientsText, customName = "Custom Food Label") {
    if (!scanResultMount) return;

    const lower = ingredientsText.toLowerCase();

    // 1. Palm Oil Detection
    const palmKeywords = ["palm oil", "palmolein", "fractionated palm", "palm kernel", "hydrogenated vegetable fat", "hydrogenated vegetable oil", "cottonseed oil"];
    const detectedPalm = palmKeywords.filter((k) => lower.includes(k));

    // 2. Hidden Sugar Detection
    const sugarKeywords = [
      "sugar", "liquid glucose", "invert sugar", "maltodextrin", "dextrose", "high fructose corn syrup",
      "cereal extract", "malt extract", "corn syrup", "cane juice", "fructose", "sucrose"
    ];
    const detectedSugars = sugarKeywords.filter((k) => lower.includes(k));

    // 3. INS Codes Detection
    const detectedIns = [];
    insDictionary.forEach((item) => {
      const codeDigits = item.code.replace(/[^0-9]/g, "");
      if (lower.includes(item.code.toLowerCase()) || (codeDigits.length >= 3 && lower.includes(codeDigits))) {
        detectedIns.push(item);
      }
    });

    // 4. Calculate Dynamic NutriTruth Score
    let computedScore = 100;
    if (detectedPalm.length > 0) computedScore -= 35;
    computedScore -= Math.min(detectedSugars.length * 15, 45);
    computedScore -= Math.min(detectedIns.length * 10, 30);
    if (lower.includes("maida") || lower.includes("refined wheat flour")) computedScore -= 10;
    computedScore = Math.max(12, Math.min(98, computedScore));

    scanResultMount.innerHTML = `
      <div style="background: var(--color-surface); border-radius: var(--radius-xl); border: 2px solid ${computedScore >= 80 ? '#10b981' : computedScore >= 50 ? '#f59e0b' : '#ef4444'}; padding: 22px; box-shadow: var(--shadow-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 14px;">
          <div>
            <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: var(--color-text-muted);">NutriTruth Scanner Output</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--color-forest);">${customName}</h3>
          </div>
          <div style="text-align: center;">
            <div class="card-score-pill ${getScoreClass(computedScore)}" style="position: static; width: 50px; height: 50px; font-size: 1.3rem;">
              ${computedScore}
            </div>
            <div style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; margin-top: 4px;">Score</div>
          </div>
        </div>

        <div style="margin-top: 16px; padding: 12px; border-radius: 12px; background: ${detectedPalm.length > 0 ? '#fee2e2' : '#ecfdf5'}; border: 1.5px solid ${detectedPalm.length > 0 ? '#fecaca' : '#a7f3d0'};">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.9rem; color: ${detectedPalm.length > 0 ? '#991b1b' : '#065f46'};">
            <span>${detectedPalm.length > 0 ? '🚨' : '✅'}</span>
            ${detectedPalm.length > 0 ? `PALM OIL DETECTED: Found (${detectedPalm.join(', ')})` : 'Zero Palm Oil Detected'}
          </div>
          <p style="font-size: 0.82rem; color: ${detectedPalm.length > 0 ? '#7f1d1d' : '#047857'}; margin-top: 4px;">
            ${detectedPalm.length > 0 ? 'Commercial palm oil/palmolein is heavily refined and loaded with saturated palmitic acid. In the TruthIn app, palm oil formulas receive an automatic penalty.' : 'Clean fats: No refined palm oil found in this ingredient excerpt.'}
          </p>
        </div>

        <div style="margin-top: 12px; padding: 12px; border-radius: 12px; background: ${detectedSugars.length > 0 ? '#fffbeb' : '#f0fdf4'}; border: 1.5px solid ${detectedSugars.length > 0 ? '#fde68a' : '#bbf7d0'};">
          <div style="font-weight: 800; font-size: 0.9rem; color: ${detectedSugars.length > 0 ? '#92400e' : '#166534'};">
            🍯 Hidden Sugars Detected (${detectedSugars.length} Synonyms Found):
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
            ${
              detectedSugars.length > 0
                ? detectedSugars.map((s) => `<span class="nt-badge" style="background: #fef3c7; color: #78350f;">⚠️ ${s}</span>`).join("")
                : '<span style="font-size: 0.84rem; color: #166534; font-weight: 700;">Zero hidden sugar aliases detected.</span>'
            }
          </div>
        </div>

        <div style="margin-top: 14px;">
          <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--color-forest);">Decoded Chemical Additives (${detectedIns.length} INS codes found):</span>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
            ${
              detectedIns.length > 0
                ? detectedIns
                    .map(
                      (item) => `
                <div style="background: #f8faf8; border: 1px solid var(--color-border); border-radius: 8px; padding: 8px 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--color-forest); font-size: 0.88rem;">${item.code} — ${item.name}</strong>
                    <span class="nt-badge ${item.safety === 'Harmful' ? 'badge-avoid' : item.safety === 'Caution' ? 'badge-caution' : 'badge-clean'}">${item.safety}</span>
                  </div>
                  <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">${item.description}</p>
                </div>
              `
                    )
                    .join("")
                : '<p style="font-size: 0.84rem; color: var(--color-text-muted); background: #f8faf8; padding: 10px; border-radius: 8px;">No flagged INS codes identified in this excerpt.</p>'
            }
          </div>
        </div>

        <button class="nt-btn nt-btn-primary" style="width: 100%; margin-top: 16px;" id="save-scan-btn">
          💾 Save Scan to History (+25 Points)
        </button>
      </div>
    `;

    scanResultMount.classList.add("active");

    const saveBtn = document.getElementById("save-scan-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        awardPoints(25);
        alert("Scan saved to your device history! +25 Truth Points awarded.");
      });
    }
  }

  // File Upload Simulator
  const labelFileInput = document.getElementById("label-file-input");
  if (labelFileInput) {
    labelFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      playBeep(true);
      if (scanInputText) {
        scanInputText.value = "Reading physical packaging label...\nRefined Wheat Flour (Maida), Palmolein Oil, Sugar (38.5%), Invert Syrup, Leavening Agent INS 500(ii), Colour INS 150d.";
      }
      setTimeout(() => {
        runIngredientAnalysis(
          "Refined Wheat Flour (Maida), Palmolein Oil, Sugar (38.5%), Invert Syrup, Leavening Agent INS 500(ii), Colour INS 150d.",
          file.name.replace(/\.[^/.]+$/, "")
        );
      }, 600);
    });
  }

  // ==========================================================================
  // INS / E-NUMBER DECODER DICTIONARY & SUGAR CALCULATOR
  // ==========================================================================
  function renderInsDictionary(query = "") {
    const insMount = document.getElementById("ins-dictionary-mount");
    if (!insMount) return;

    const filtered = insDictionary.filter((item) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    });

    insMount.innerHTML = filtered
      .map(
        (item) => `
      <div style="background: var(--color-surface); border: 1.5px solid var(--color-border); border-radius: var(--radius-lg); padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="font-size: 1.1rem; color: var(--color-forest);">${item.code}</strong>
            <span class="nt-badge ${item.safety === 'Harmful' ? 'badge-avoid' : item.safety === 'Caution' ? 'badge-caution' : 'badge-clean'}">${item.safety}</span>
          </div>
          <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--color-text-main);">${item.name}</h4>
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-light);">${item.type}</span>
          <p style="font-size: 0.84rem; color: var(--color-text-muted); margin-top: 6px; line-height: 1.5;">${item.description}</p>
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--color-border-subtle); font-size: 0.76rem; color: var(--color-text-muted);">
          <strong>Commonly found in:</strong> ${item.foundIn}
        </div>
      </div>
    `
      )
      .join("");
  }

  const insSearchInput = document.getElementById("ins-search-input");
  if (insSearchInput) {
    insSearchInput.addEventListener("input", (e) => {
      renderInsDictionary(e.target.value);
    });
  }

  // Interactive Sugar Cubes Calculator
  const calcSugarInput = document.getElementById("calc-sugar-per-100g");
  const calcServingInput = document.getElementById("calc-serving-size");
  const calcOutputCubes = document.getElementById("calc-output-cubes");
  const calcOutputTeaspoons = document.getElementById("calc-output-teaspoons");
  const calcOutputWhoPercent = document.getElementById("calc-output-who-percent");
  const calcCubesPile = document.getElementById("calc-cubes-pile");

  function updateSugarCalculator() {
    if (!calcSugarInput || !calcServingInput) return;
    const sugarPer100g = parseFloat(calcSugarInput.value) || 0;
    const servingSize = parseFloat(calcServingInput.value) || 0;

    const totalSugarInServing = (sugarPer100g * servingSize) / 100;
    const cubes = totalSugarInServing / 4;
    const teaspoons = totalSugarInServing / 4;
    const whoPercent = (totalSugarInServing / 25) * 100;

    if (calcOutputCubes) calcOutputCubes.textContent = cubes.toFixed(1);
    if (calcOutputTeaspoons) calcOutputTeaspoons.textContent = teaspoons.toFixed(1);
    if (calcOutputWhoPercent) calcOutputWhoPercent.textContent = `${whoPercent.toFixed(0)}%`;

    if (calcCubesPile) {
      let pileHtml = "";
      const displayCubes = Math.min(Math.round(cubes), 18);
      for (let i = 0; i < displayCubes; i++) {
        pileHtml += '<div class="sugar-cube-visual" style="width: 24px; height: 24px; font-size: 13px;">🧊</div>';
      }
      calcCubesPile.innerHTML = pileHtml || '<span style="color: #15803d; font-weight: 700;">Zero Added Sugar Cubes</span>';
    }
  }

  if (calcSugarInput && calcServingInput) {
    calcSugarInput.addEventListener("input", updateSugarCalculator);
    calcServingInput.addEventListener("input", updateSugarCalculator);
  }

  // ==========================================================================
  // INITIALIZATION ON LOAD
  // ==========================================================================
  function init() {
    renderProductCards();
    updateBookmarkBadge();
    updateStreakUI();
    updateSugarCalculator();
  }

  init();
})();
