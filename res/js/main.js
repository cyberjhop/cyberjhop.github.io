/* =========================================================================
   Jhop — Portfolio Dashboard
   Renders every view from window.PORTFOLIO (res/js/data.js).

   Sections:
     1. Helpers & derived data
     2. Theme, toast, storage
     3. Sidebar (mobile drawer + desktop collapse)
     4. Router (hash routes, legacy anchor aliases)
     5. Shared components (thumbs, chips, charts)
     6. Views: overview, about, experience, skills, projects, media, services, contact
     7. Project drawer
     8. Lightbox (image / local mp4 / Google Drive)
     9. Command palette
    10. Boot
   ========================================================================= */
(function () {
	"use strict";

	const D = window.PORTFOLIO;
	if (!D) return;

	// ===== 1. HELPERS & DERIVED DATA =====
	const root = document.documentElement;
	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
	const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
	const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ESC_MAP[c]);
	const icon = (name, cls = "") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
	const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
	const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
	const mqMobile = window.matchMedia("(max-width: 767px)");
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

	const drivePreview = (id) => `https://drive.google.com/file/d/${id}/preview`;
	const driveThumb = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w640`;

	const NOW = new Date();
	const NOW_YEAR = NOW.getFullYear();
	const NOW_FRAC = NOW_YEAR + NOW.getMonth() / 12;

	const DISCIPLINES = {
		dev: { label: "Development", icon: "code" },
		design: { label: "Design", icon: "image" },
		video: { label: "Video", icon: "film" },
		ai: { label: "AI", icon: "sparkles" },
	};
	const CATEGORY_LABEL = Object.fromEntries(D.mediaCategories.map((c) => [c.id, c.label]));
	const SOCIAL_ICON = { github: "github", linkedin: "linkedin", x: "xlogo", instagram: "instagram" };

	// Give every media item a stable id for search + deep links.
	const seen = {};
	D.media.forEach((m) => {
		let id = `${m.category}-${slug(m.title)}`;
		seen[id] = (seen[id] || 0) + 1;
		if (seen[id] > 1) id += `-${seen[id]}`;
		m.id = id;
	});

	const countBy = (list, key) =>
		list.reduce((acc, item) => {
			acc[item[key]] = (acc[item[key]] || 0) + 1;
			return acc;
		}, {});

	const careerStart = Math.min(...D.experience.map((e) => e.start));
	const currentRole = D.experience.find((e) => e.end === null);

	function durationLabel(start, end) {
		const span = (end === null ? NOW_FRAC : end) - start;
		if (span < 1) return "< 1 yr";
		const yrs = Math.floor(span);
		return end === null ? `${yrs}+ yrs` : plural(yrs, "yr");
	}
	const periodLabel = (start, end) => (end === null ? `${start} — Present` : start === end ? `${start}` : `${start} — ${end}`);

	// ===== 2. THEME, TOAST, STORAGE =====
	const store = {
		get(k) {
			try {
				return localStorage.getItem(k);
			} catch (e) {
				return null;
			}
		},
		set(k, v) {
			try {
				localStorage.setItem(k, v);
			} catch (e) {
				/* storage unavailable: preference just won't persist */
			}
		},
	};

	const themeBtn = $("#themeBtn");
	const effectiveTheme = () => root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

	function syncThemeButton() {
		const next = effectiveTheme() === "dark" ? "light" : "dark";
		themeBtn.setAttribute("aria-label", `Switch to ${next} theme`);
	}
	function toggleTheme() {
		const next = effectiveTheme() === "dark" ? "light" : "dark";
		root.setAttribute("data-theme", next);
		store.set("theme", next);
		syncThemeButton();
		toast(`${next === "dark" ? "Dark" : "Light"} theme`);
	}
	themeBtn.addEventListener("click", toggleTheme);
	syncThemeButton();

	const toastEl = $("#toast");
	let toastTimer;
	function toast(msg) {
		toastEl.textContent = msg;
		toastEl.classList.add("show");
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
	}

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(D.profile.email);
			toast(`Copied ${D.profile.email}`);
		} catch (e) {
			window.location.href = `mailto:${D.profile.email}`;
		}
	}

	// Focus trap shared by the sidebar drawer, project drawer, lightbox and palette.
	const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, iframe, video[controls], [tabindex]:not([tabindex="-1"])';
	function trapFocus(container, e) {
		if (e.key !== "Tab") return;
		const items = $$(FOCUSABLE, container).filter((el) => el.getClientRects().length);
		if (!items.length) return;
		const first = items[0];
		const last = items[items.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	// Overlay manager so body scroll lock + Escape work for any stacked layer.
	const openLayers = [];
	function pushLayer(layer) {
		openLayers.push(layer);
		document.body.classList.add("no-scroll");
	}
	function popLayer(layer) {
		const i = openLayers.indexOf(layer);
		if (i > -1) openLayers.splice(i, 1);
		if (!openLayers.length) document.body.classList.remove("no-scroll");
	}

	// ===== 3. SIDEBAR =====
	const sidebar = $("#sidebar");
	const backdrop = $("#sidebarBackdrop");
	const menuBtn = $("#menuBtn");
	const collapseBtn = $("#collapseBtn");
	const sidebarLayer = { close: closeSidebar, el: sidebar };

	$("#sidebarSocials").innerHTML = D.socials
		.map((s) => `<li><a class="icon-btn" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}" data-tip="${esc(s.label)}">${icon(SOCIAL_ICON[s.id] || "external")}</a></li>`)
		.join("");

	// Tooltip labels for the collapsed icon rail.
	$$(".nav-item").forEach((a) => a.setAttribute("data-tip", $(".nav-label", a).textContent));

	$$("[data-count]").forEach((el) => {
		const key = el.getAttribute("data-count");
		el.textContent = D[key] ? D[key].length : "";
	});

	function openSidebar() {
		root.classList.add("sidebar-open");
		backdrop.hidden = false;
		menuBtn.setAttribute("aria-expanded", "true");
		pushLayer(sidebarLayer);
		const active = $(".nav-item.active", sidebar) || $(".nav-item", sidebar);
		active && active.focus();
	}
	function closeSidebar() {
		if (!root.classList.contains("sidebar-open")) return;
		root.classList.remove("sidebar-open");
		backdrop.hidden = true;
		menuBtn.setAttribute("aria-expanded", "false");
		popLayer(sidebarLayer);
		menuBtn.focus();
	}
	menuBtn.addEventListener("click", openSidebar);
	backdrop.addEventListener("click", closeSidebar);
	$("#sidebarClose").addEventListener("click", closeSidebar);
	sidebar.addEventListener("keydown", (e) => root.classList.contains("sidebar-open") && trapFocus(sidebar, e));
	sidebar.addEventListener("click", (e) => {
		if (e.target.closest("a") && root.classList.contains("sidebar-open")) {
			root.classList.remove("sidebar-open");
			backdrop.hidden = true;
			menuBtn.setAttribute("aria-expanded", "false");
			popLayer(sidebarLayer);
		}
	});
	mqMobile.addEventListener("change", () => !mqMobile.matches && root.classList.contains("sidebar-open") && closeSidebar());

	// Icon rail: always on tablet widths, user-toggled on desktop, never on mobile.
	const mqTablet = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
	function syncRail() {
		root.classList.toggle("is-rail", mqTablet.matches || (!mqMobile.matches && root.classList.contains("sidebar-collapsed")));
	}
	mqTablet.addEventListener("change", syncRail);
	mqMobile.addEventListener("change", syncRail);

	function syncCollapseButton() {
		syncRail();
		const collapsed = root.classList.contains("sidebar-collapsed");
		collapseBtn.setAttribute("aria-expanded", String(!collapsed));
		collapseBtn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
	}
	collapseBtn.addEventListener("click", () => {
		root.classList.toggle("sidebar-collapsed");
		store.set("sidebar", root.classList.contains("sidebar-collapsed") ? "collapsed" : "expanded");
		syncCollapseButton();
	});
	syncCollapseButton();

	// ===== 4. ROUTER =====
	const ROUTES = $$("[data-view]").map((v) => v.getAttribute("data-view"));
	// Anchors from the previous single-page portfolio keep working.
	const ALIASES = {
		home: ["overview"],
		tools: ["skills"],
		reel: ["media", "reel"],
		youtube: ["media", "channels"],
		values: ["about"],
		process: ["services"],
	};
	const rendered = {};
	const renderers = {};
	let currentRoute = null;
	let firstRoute = true;

	function parseHash() {
		const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
		let [route, param] = raw.split("/");
		if (ALIASES[route]) {
			const [aliasRoute, aliasParam] = ALIASES[route];
			route = aliasRoute;
			param = aliasParam || param;
			history.replaceState(null, "", `#${route}${param ? "/" + param : ""}`);
		}
		if (!ROUTES.includes(route)) route = "overview";
		return { route, param: param || null };
	}

	function handleRoute() {
		const { route, param } = parseHash();
		const view = $(`[data-view="${route}"]`);

		if (route !== currentRoute) {
			$$("[data-view]").forEach((v) => v.classList.toggle("is-active", v === view));
			$$(".nav-item[data-route]").forEach((a) => {
				const on = a.getAttribute("data-route") === route;
				a.classList.toggle("active", on);
				on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
			});
			const title = view.getAttribute("data-title");
			const group = view.getAttribute("data-group");
			$("#crumbPage").textContent = title;
			const crumbGroup = $("#crumbGroup");
			crumbGroup.textContent = group;
			crumbGroup.hidden = !group;
			document.title = route === "overview" ? "Jhop — Full Stack Developer · Designer · Video Editor" : `${title} · Jhop`;

			if (!rendered[route] && renderers[route]) {
				renderers[route]($("[data-render]", view));
				rendered[route] = true;
			}
			if (route !== "projects") closeDrawer(true);
			window.scrollTo(0, 0);
			if (!firstRoute) {
				const h1 = $("h1", view);
				h1.setAttribute("tabindex", "-1");
				h1.focus({ preventScroll: true });
			}
			currentRoute = route;
		}
		firstRoute = false;

		if (route === "projects") {
			param ? openProject(param) : closeDrawer(true);
		}
		if (route === "media") mediaState.applyParam(param);
	}
	window.addEventListener("hashchange", handleRoute);

	// Programmatic navigation is synchronous (pushState + handleRoute) so callers
	// can act on the rendered view immediately; back/forward still fire hashchange.
	const go = (hash) => {
		if (location.hash !== `#${hash}`) history.pushState(null, "", `#${hash}`);
		handleRoute();
	};

	// ===== 5. SHARED COMPONENTS =====

	// Thumbnail for a media-like object ({kind, src|driveId, title}).
	function thumb(m, { hoverPlay = false } = {}) {
		const alt = esc(m.title || "");
		if (m.kind === "image") return `<img src="${esc(m.src)}" alt="${alt}" loading="lazy" decoding="async" />`;
		// Local video: show the poster frame; the mp4 only loads when a tile is hovered/focused.
		if (m.kind === "video")
			return hoverPlay
				? `<video src="${esc(m.src)}" poster="${esc(m.poster || "")}" muted playsinline loop preload="none" data-hover-play aria-label="${alt}"></video>`
				: `<img src="${esc(m.poster || "")}" alt="${alt}" loading="lazy" decoding="async" />`;
		return `<img src="${driveThumb(m.driveId)}" alt="${alt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-drive-thumb />`;
	}

	// Drive posters fail if the file isn't public or thumbnails are blocked — show a tidy fallback tile.
	document.addEventListener(
		"error",
		(e) => {
			const img = e.target;
			if (img.tagName === "IMG" && img.hasAttribute("data-drive-thumb")) {
				const fb = document.createElement("span");
				fb.className = "thumb-fallback";
				fb.innerHTML = icon("play");
				img.replaceWith(fb);
			}
		},
		true
	);

	// Hover/focus-to-play for local video tiles (no constant autoplay).
	function bindHoverPlay(container) {
		const play = (e) => {
			const v = e.target.closest("[data-hover-wrap]") && $("video[data-hover-play]", e.target.closest("[data-hover-wrap]"));
			if (v && !reducedMotion.matches) v.play().catch(() => {});
		};
		const stop = (e) => {
			const v = e.target.closest("[data-hover-wrap]") && $("video[data-hover-play]", e.target.closest("[data-hover-wrap]"));
			if (v) v.pause();
		};
		container.addEventListener("pointerover", play);
		container.addEventListener("pointerout", stop);
		container.addEventListener("focusin", play);
		container.addEventListener("focusout", stop);
	}

	const chips = (tags, cls = "") => `<ul class="chips ${cls}">${tags.map((t) => `<li class="chip">${esc(t)}</li>`).join("")}</ul>`;
	const badge = (disc) => {
		const d = DISCIPLINES[disc];
		return `<span class="badge badge-${disc}">${icon(d.icon, "icon-sm")}${esc(d.label)}</span>`;
	};
	const cardHead = (title, action = "") => `<header class="card-head"><h2>${title}</h2>${action}</header>`;
	const cardLink = (href, label) => `<a class="card-link" href="${href}">${esc(label)}${icon("arrow-right", "icon-sm")}</a>`;
	const srTable = (caption, head, rows) =>
		`<div class="sr-only"><table><caption>${esc(caption)}</caption><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
			.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
			.join("")}</tbody></table></div>`;

	// --- Chart tooltip (pointer only; every value is also labelled or in a table) ---
	const tip = $("#chartTip");
	document.addEventListener("pointermove", (e) => {
		const t = e.target.closest && e.target.closest("[data-chart-tip]");
		if (!t) {
			tip.hidden = true;
			return;
		}
		tip.textContent = t.getAttribute("data-chart-tip");
		tip.hidden = false;
		const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
		const y = e.clientY - tip.offsetHeight - 12;
		tip.style.transform = `translate(${x}px, ${y < 8 ? e.clientY + 18 : y}px)`;
	});

	// Chart: media library by category (single series → one hue, direct value labels).
	function categoryChart() {
		const counts = countBy(D.media, "category");
		const total = D.media.length;
		const max = Math.max(...Object.values(counts));
		const rows = D.mediaCategories.map((c) => ({ ...c, n: counts[c.id] || 0 }));
		return `
			<div class="bar-chart" role="group" aria-label="Creative library pieces by category">
				${rows
					.map(
						(r) => `
					<a class="bar-row" href="#media/${r.id}" data-chart-tip="${r.n} of ${total} pieces · ${Math.round((r.n / total) * 100)}%">
						<span class="bar-label">${esc(r.label)}</span>
						<span class="bar-track"><span class="bar-fill" style="--w:${(r.n / max) * 100}%"></span></span>
						<span class="bar-value">${r.n}</span>
					</a>`
					)
					.join("")}
			</div>
			${srTable("Creative library by category", ["Category", "Pieces"], rows.map((r) => [r.label, r.n]))}`;
	}

	// Chart: format mix inside a category (stacked 100% bar, categorical slots in fixed order).
	function formatMix(category) {
		const items = D.media.filter((m) => m.category === category);
		const counts = Object.entries(countBy(items, "format")).sort((a, b) => b[1] - a[1]);
		const total = items.length;
		return `
			<div class="mix">
				<div class="mix-head"><span>${esc(CATEGORY_LABEL[category])}</span><span class="muted">${plural(total, "piece")}</span></div>
				<div class="mix-bar" role="img" aria-label="${esc(CATEGORY_LABEL[category])} by format: ${counts.map(([f, n]) => `${f} ${n}`).join(", ")}">
					${counts.map(([f, n], i) => `<span class="mix-seg" style="--w:${(n / total) * 100}%;--c:var(--series-${i + 1})" data-chart-tip="${esc(f)}: ${n} of ${total}"></span>`).join("")}
				</div>
				<ul class="legend">
					${counts.map(([f, n], i) => `<li><span class="swatch" style="--c:var(--series-${i + 1})"></span>${esc(f)}<span class="legend-n">${n}</span></li>`).join("")}
				</ul>
			</div>`;
	}

	// Chart: career timeline (Gantt). Work + tertiary education on a shared year axis.
	function timelineChart() {
		const edu = D.education.filter((e) => e.level === "Tertiary").map((e) => ({ label: e.school, sub: e.degree, start: e.start, end: e.end, kind: "edu" }));
		const work = D.experience.map((e) => ({ label: e.org, sub: e.role, start: e.start, end: e.end, kind: "work" }));
		const rows = [...edu, ...work].sort((a, b) => a.start - b.start || (a.kind === "edu" ? -1 : 1));
		const min = Math.min(...rows.map((r) => r.start));
		const max = NOW_YEAR + 1;
		const pos = (y) => ((y - min) / (max - min)) * 100;
		const years = [];
		for (let y = min; y <= max; y++) years.push(y);

		return `
			<div class="gantt" role="group" aria-label="Career and education timeline, ${min} to present">
				<ul class="legend legend-inline" aria-hidden="true">
					<li><span class="swatch" style="--c:var(--series-1)"></span>Work</li>
					<li><span class="swatch" style="--c:var(--series-3)"></span>Education</li>
				</ul>
				<div class="gantt-rows">
					${rows
						.map((r) => {
							const end = r.end === null ? NOW_FRAC : r.end === r.start ? r.start + 1 : r.end;
							return `
						<div class="gantt-row">
							<div class="gantt-label"><strong>${esc(r.label)}</strong><span>${esc(r.sub)}</span></div>
							<div class="gantt-track">
								${years.map((y) => `<span class="gantt-grid" style="--x:${pos(y)}%"></span>`).join("")}
								<span class="gantt-bar ${r.end === null ? "is-current" : ""}" style="--x:${pos(r.start)}%;--w:${pos(end) - pos(r.start)}%;--c:var(--series-${r.kind === "edu" ? 3 : 1})"
									data-chart-tip="${esc(r.label)} · ${periodLabel(r.start, r.end)}"><span class="gantt-bar-text">${periodLabel(r.start, r.end)}</span></span>
							</div>
						</div>`;
						})
						.join("")}
					<div class="gantt-row gantt-axis" aria-hidden="true">
						<div class="gantt-label"></div>
						<div class="gantt-track">${years
							.filter((y) => y < max)
							.map((y) => `<span class="gantt-year" style="--x:${pos(y)}%">${y % 2 === 1 && years.length > 8 ? "" : y}</span>`)
							.join("")}</div>
					</div>
				</div>
			</div>
			${srTable("Career timeline", ["Organisation", "Role", "Period"], rows.map((r) => [r.label, r.sub, periodLabel(r.start, r.end)]))}`;
	}

	function skillMeter(g) {
		return `
			<div class="meter-head"><span>Stated proficiency</span><span class="meter-value">${g.level} · ${g.progress}%</span></div>
			<div class="meter" role="progressbar" aria-valuenow="${g.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(g.name)} proficiency"><span style="--w:${g.progress}%"></span></div>`;
	}

	function socialList(cls = "") {
		return `<ul class="social-list ${cls}">${D.socials
			.map(
				(s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${icon(SOCIAL_ICON[s.id])}<span><strong>${esc(s.label)}</strong><small>${esc(s.handle)}</small></span>${icon(
					"external",
					"icon-sm muted"
				)}</a></li>`
			)
			.join("")}</ul>`;
	}

	// ===== 6. VIEWS =====

	// ----- Overview -----
	renderers.overview = (el) => {
		const p = D.profile;
		const disciplines = new Set(D.projects.map((x) => x.discipline)).size;
		const exp = D.stats.find((s) => /year/i.test(s.label));
		const kpis = [
			{ href: "#media", label: "Portfolio pieces", value: D.media.length, sub: "graphics, videos & reel clips", ic: "film" },
			{ href: "#projects", label: "Featured projects", value: D.projects.length, sub: `across ${disciplines} disciplines`, ic: "folder" },
			{ href: "#skills", label: "Tools in stack", value: D.tools.length, sub: `in ${D.toolGroups.length} categories`, ic: "cpu" },
			{ href: "#experience", label: "Experience", value: exp ? `${exp.value} yrs` : "—", sub: `career since ${careerStart}`, ic: "briefcase" },
		];

		el.innerHTML = `
			<div class="dash-grid">
				<article class="card profile-card span-8">
					<img class="profile-photo" src="${esc(p.photo)}" alt="Portrait of ${esc(p.fullName)}" width="96" height="96" />
					<div class="profile-body">
						<p class="eyebrow">${esc(p.headline)}</p>
						<h2 class="profile-name">${esc(p.fullName)} <span class="muted">· ${esc(p.name)}</span></h2>
						<p class="profile-tagline">${esc(p.tagline)}</p>
						<ul class="role-list">${p.roles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
						<div class="btn-row">
							<a class="btn btn-primary" href="#contact">${icon("send")}Start a project</a>
							<a class="btn btn-secondary" href="#projects">View my work</a>
						</div>
					</div>
				</article>

				<article class="card status-card span-4">
					${cardHead("Availability")}
					<p class="status-line"><span class="status-dot" aria-hidden="true"></span>${esc(p.availability)}</p>
					<p class="muted small">${esc(p.responseTime)}</p>
					<ul class="kv-list">
						<li>${icon("pin")}<span>${esc(p.location)}</span></li>
						<li>${icon("mail")}<a href="mailto:${esc(p.email)}">${esc(p.email)}</a><button class="icon-btn icon-btn-sm" data-copy-email aria-label="Copy email address">${icon("copy", "icon-sm")}</button></li>
						<li>${icon("phone")}<a href="${esc(p.phoneHref)}">${esc(p.phone)}</a></li>
					</ul>
					<div class="status-foot">
						<ul class="icon-row" aria-label="Social profiles">
							${D.socials.map((s) => `<li><a class="icon-btn" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}">${icon(SOCIAL_ICON[s.id])}</a></li>`).join("")}
							${D.channels.map((c) => `<li><a class="icon-btn" href="${esc(c.url)}" target="_blank" rel="noopener" aria-label="YouTube: ${esc(c.name)}">${icon("youtube")}</a></li>`).join("")}
						</ul>
						<a class="btn btn-secondary btn-sm" href="${esc(p.resume)}" download>${icon("download")}Resume</a>
					</div>
				</article>

				<ul class="kpi-row span-12" aria-label="Portfolio at a glance">
					${kpis
						.map(
							(k) => `
						<li><a class="card kpi" href="${k.href}">
							<span class="kpi-label">${icon(k.ic, "icon-sm")}${esc(k.label)}</span>
							<span class="kpi-value">${esc(k.value)}</span>
							<span class="kpi-sub">${esc(k.sub)}</span>
						</a></li>`
						)
						.join("")}
				</ul>

				<article class="card span-6">
					${cardHead("Creative library by category", cardLink("#media", "Open library"))}
					<p class="card-sub">${plural(D.media.length, "piece")} in the library. Pick a bar to filter.</p>
					${categoryChart()}
				</article>

				<article class="card span-6">
					${cardHead("Format mix", cardLink("#media", "Browse"))}
					<p class="card-sub">How the graphic and video work splits by format.</p>
					<div class="mix-stack">${formatMix("graphic")}${formatMix("video")}</div>
				</article>

				<article class="card span-12">
					${cardHead("Career timeline", cardLink("#experience", "Full history"))}
					${timelineChart()}
				</article>

				<article class="card span-7">
					${cardHead("Featured work", cardLink("#projects", "All projects"))}
					<ul class="row-list">
						${D.projects
							.slice(0, 4)
							.map(
								(x) => `
							<li><a class="row-item" href="#projects/${x.id}">
								<span class="row-thumb">${thumb({ ...x.media, title: "" })}</span>
								<span class="row-text"><strong>${esc(x.title)}</strong><small>${esc(x.type)}</small></span>
								${badge(x.discipline)}
							</a></li>`
							)
							.join("")}
					</ul>
				</article>

				<article class="card span-5">
					${cardHead("Skill groups", cardLink("#skills", "Stack"))}
					<ul class="skill-summary">
						${D.skillGroups
							.map(
								(g) => `
							<li>
								<div class="skill-summary-head">${icon(g.icon)}<strong>${esc(g.name)}</strong><span class="muted small">${plural(g.tags.length, "skill")}</span></div>
								${skillMeter(g)}
							</li>`
							)
							.join("")}
					</ul>
				</article>
			</div>`;
	};

	// ----- About -----
	renderers.about = (el) => {
		const p = D.profile;
		el.innerHTML = `
			<div class="about-grid">
				<aside class="card about-card">
					<img class="about-photo" src="${esc(p.photo)}" alt="Portrait of ${esc(p.fullName)}" loading="lazy" />
					<h2>${esc(p.fullName)}</h2>
					<p class="muted">${esc(p.roles.join(" · "))}</p>
					<p class="status-line"><span class="status-dot" aria-hidden="true"></span>Available for work</p>
					<ul class="kv-list">
						<li>${icon("pin")}<span>${esc(p.location)}</span></li>
						<li>${icon("mail")}<a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>
					</ul>
					${socialList("social-list-compact")}
					<div class="btn-row btn-row-stack">
						<a class="btn btn-primary" href="${esc(p.resume)}" download>${icon("download")}Download resume</a>
						<a class="btn btn-secondary" href="#contact">Let's work together</a>
					</div>
				</aside>

				<div class="about-main">
					<article class="card prose-card">
						${cardHead("Hi, I'm Jhop")}
						<p class="lead">${esc(p.intro)}</p>
						<ul class="check-list">${p.highlights.map((h) => `<li>${icon("check")}${esc(h)}</li>`).join("")}</ul>
						<p>${esc(p.outro)}</p>
						<p class="muted">${esc(p.summary)}</p>
					</article>

					<ul class="stat-row" aria-label="At a glance">
						${D.stats.map((s) => `<li class="card stat"><span class="stat-value">${esc(s.value)}</span><span class="stat-label">${esc(s.label)}</span></li>`).join("")}
					</ul>

					<article class="card">
						${cardHead("Working style")}
						<p>${esc(p.personalSkills)}</p>
						${chips(p.softSkills)}
					</article>
				</div>
			</div>

			<section class="section" aria-labelledby="h-values">
				<div class="section-head"><h2 id="h-values">What I bring to every project</h2><p class="muted">The principles behind every pixel, line of code, and cut.</p></div>
				<ul class="tile-grid">
					${D.values.map((v) => `<li class="card tile"><span class="tile-icon">${icon(v.icon)}</span><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p></li>`).join("")}
				</ul>
			</section>`;
	};

	// ----- Experience -----
	renderers.experience = (el) => {
		const summary = [
			{ label: "Current role", value: currentRole ? currentRole.org : "—", sub: currentRole ? `since ${currentRole.start}` : "" },
			{ label: "Career since", value: careerStart, sub: `${plural(D.experience.length, "role")} across ${plural(new Set(D.experience.map((e) => e.org)).size, "organisation")}` },
			{ label: "Education", value: "BS Information Technology", sub: `${D.education[0].school}, ${D.education[0].end}` },
		];
		el.innerHTML = `
			<ul class="kpi-row kpi-row-3" aria-label="Career summary">
				${summary.map((s) => `<li class="card kpi"><span class="kpi-label">${esc(s.label)}</span><span class="kpi-value kpi-value-sm">${esc(s.value)}</span><span class="kpi-sub">${esc(s.sub)}</span></li>`).join("")}
			</ul>

			<article class="card">
				${cardHead("Timeline")}
				${timelineChart()}
			</article>

			<div class="exp-grid">
				<section class="card" aria-labelledby="h-roles">
					${cardHead('<span id="h-roles">Roles</span>')}
					<ol class="timeline">
						${D.experience
							.map(
								(e) => `
							<li class="timeline-item ${e.end === null ? "is-current" : ""}">
								<span class="timeline-dot" aria-hidden="true"></span>
								<div class="timeline-meta"><span>${periodLabel(e.start, e.end)}</span><span class="pill">${durationLabel(e.start, e.end)}</span>${e.end === null ? '<span class="pill pill-accent">Current</span>' : ""}</div>
								<h3>${esc(e.role)}</h3>
								<p class="timeline-org">${esc(e.org)}</p>
								<p>${esc(e.desc)}</p>
								${chips(e.tags, "chips-sm")}
							</li>`
							)
							.join("")}
					</ol>
				</section>

				<section class="card" aria-labelledby="h-edu">
					${cardHead('<span id="h-edu">Education</span>')}
					<ol class="edu-list">
						${D.education
							.map(
								(e) => `
							<li>
								<span class="edu-icon">${icon("cap")}</span>
								<div>
									<p class="eyebrow">${esc(e.level)} · ${e.start} — ${e.end}</p>
									<h3>${esc(e.degree || e.school)}</h3>
									${e.degree ? `<p class="timeline-org">${esc(e.school)}</p>` : ""}
									<p class="muted small">${esc(e.place)}</p>
								</div>
							</li>`
							)
							.join("")}
					</ol>
					<a class="btn btn-secondary btn-block" href="${esc(D.profile.resume)}" target="_blank" rel="noopener">${icon("file")}View full resume (PDF)</a>
				</section>
			</div>`;
	};

	// ----- Skills -----
	renderers.skills = (el) => {
		el.innerHTML = `
			<ul class="skill-grid">
				${D.skillGroups
					.map(
						(g) => `
					<li class="card skill-card">
						<div class="skill-card-head"><span class="tile-icon">${icon(g.icon)}</span><h2>${esc(g.name)}</h2></div>
						${skillMeter(g)}
						${chips(g.tags)}
					</li>`
					)
					.join("")}
			</ul>

			<article class="card">
				${cardHead("Tools &amp; technologies", `<span class="muted small">${plural(D.tools.length, "tool")}</span>`)}
				<p class="card-sub">The toolkit I use to bring ideas to life.</p>
				<div class="tool-matrix">
					${D.toolGroups
						.map((grp) => {
							const tools = D.tools.filter((t) => t.group === grp);
							return `
						<section class="tool-group" aria-label="${esc(grp)}">
							<h3>${esc(grp)} <span class="muted">${tools.length}</span></h3>
							<ul>${tools
								.map((t) => `<li class="tool">${t.img ? `<img src="${esc(t.img)}" alt="" />` : t.icon}<span>${esc(t.name)}</span></li>`)
								.join("")}</ul>
						</section>`;
						})
						.join("")}
				</div>
			</article>

			<div class="two-col">
				<article class="card">
					${cardHead("Also on my resume")}
					${chips(D.otherSkills)}
				</article>
				<article class="card">
					${cardHead("Soft skills")}
					${chips(D.profile.softSkills)}
				</article>
			</div>

			<aside class="card cta-card">
				<div><h2>Have a project in mind?</h2><p class="muted">Tell me what you need and I'll put together a custom quote.</p></div>
				<a class="btn btn-primary" href="#contact">Get a custom quote</a>
			</aside>`;
	};

	// ----- Projects -----
	const projectState = { q: "", disc: "all", sort: "featured", view: store.get("projectsView") === "table" ? "table" : "grid", list: D.projects.slice() };

	renderers.projects = (el) => {
		const counts = countBy(D.projects, "discipline");
		el.innerHTML = `
			<div class="toolbar" role="search">
				<label class="search-field">
					${icon("search")}
					<span class="sr-only">Search projects</span>
					<input type="search" id="projectSearch" placeholder="Search projects, tags, tools…" autocomplete="off" />
				</label>
				<div class="chip-group" role="group" aria-label="Filter by discipline">
					<button class="filter-chip" aria-pressed="true" data-disc="all">All <span>${D.projects.length}</span></button>
					${Object.keys(DISCIPLINES)
						.filter((k) => counts[k])
						.map((k) => `<button class="filter-chip" aria-pressed="false" data-disc="${k}">${esc(DISCIPLINES[k].label)} <span>${counts[k]}</span></button>`)
						.join("")}
				</div>
				<div class="toolbar-end">
					<label class="select-field"><span class="sr-only">Sort projects</span>
						<select id="projectSort"><option value="featured">Featured order</option><option value="az">Name A–Z</option><option value="discipline">Discipline</option></select>
					</label>
					<div class="segmented" role="group" aria-label="Layout">
						<button data-layout="grid" aria-pressed="${projectState.view === "grid"}" aria-label="Grid view">${icon("grid")}</button>
						<button data-layout="table" aria-pressed="${projectState.view === "table"}" aria-label="Table view">${icon("list")}</button>
					</div>
				</div>
			</div>
			<p class="result-count" id="projectCount" aria-live="polite"></p>
			<div id="projectResults"></div>`;

		$("#projectSearch", el).addEventListener("input", (e) => {
			projectState.q = e.target.value.trim().toLowerCase();
			drawProjects();
		});
		$("#projectSort", el).addEventListener("change", (e) => {
			projectState.sort = e.target.value;
			drawProjects();
		});
		$$("[data-disc]", el).forEach((b) =>
			b.addEventListener("click", () => {
				projectState.disc = b.getAttribute("data-disc");
				$$("[data-disc]", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
				drawProjects();
			})
		);
		$$("[data-layout]", el).forEach((b) =>
			b.addEventListener("click", () => {
				projectState.view = b.getAttribute("data-layout");
				store.set("projectsView", projectState.view);
				$$("[data-layout]", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
				drawProjects();
			})
		);
		el.addEventListener("click", (e) => {
			if (e.target.closest("[data-clear-filters]")) {
				projectState.q = "";
				projectState.disc = "all";
				$("#projectSearch", el).value = "";
				$$("[data-disc]", el).forEach((x) => x.setAttribute("aria-pressed", String(x.getAttribute("data-disc") === "all")));
				drawProjects();
			}
		});
		bindHoverPlay(el);
		drawProjects();
	};

	function drawProjects() {
		const s = projectState;
		let list = D.projects.filter((p) => {
			if (s.disc !== "all" && p.discipline !== s.disc) return false;
			if (!s.q) return true;
			const hay = [p.title, p.type, p.desc, p.role, DISCIPLINES[p.discipline].label, ...p.tags].join(" ").toLowerCase();
			return s.q.split(/\s+/).every((w) => hay.includes(w));
		});
		if (s.sort === "az") list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
		if (s.sort === "discipline") list = list.slice().sort((a, b) => DISCIPLINES[a.discipline].label.localeCompare(DISCIPLINES[b.discipline].label));
		s.list = list;

		$("#projectCount").textContent = `Showing ${list.length} of ${plural(D.projects.length, "project")}`;
		const out = $("#projectResults");

		if (!list.length) {
			out.innerHTML = `<div class="empty">${icon("search")}<h2>No projects match</h2><p class="muted">Try a different search term or discipline.</p><button class="btn btn-secondary btn-sm" data-clear-filters>Clear filters</button></div>`;
			return;
		}
		if (s.view === "table") {
			out.innerHTML = `
				<div class="table-wrap card">
					<table class="data-table">
						<thead><tr><th scope="col">Project</th><th scope="col">Discipline</th><th scope="col">Role</th><th scope="col">Tags</th><th scope="col"><span class="sr-only">Open</span></th></tr></thead>
						<tbody>
							${list
								.map(
									(p) => `
								<tr>
									<th scope="row"><a class="table-title" href="#projects/${p.id}"><span class="row-thumb">${thumb({ ...p.media, title: "" })}</span><span><strong>${esc(p.title)}</strong><small>${esc(p.type)}</small></span></a></th>
									<td data-label="Discipline">${badge(p.discipline)}</td>
									<td data-label="Role">${esc(p.role)}</td>
									<td data-label="Tags">${chips(p.tags, "chips-sm")}</td>
									<td class="cell-action"><a class="icon-btn" href="#projects/${p.id}" aria-label="Open ${esc(p.title)}" tabindex="-1">${icon("chevron-right")}</a></td>
								</tr>`
								)
								.join("")}
						</tbody>
					</table>
				</div>`;
			return;
		}
		out.innerHTML = `
			<ul class="project-grid">
				${list
					.map(
						(p) => `
					<li class="card project-card" data-hover-wrap>
						<div class="project-thumb">${thumb({ ...p.media, title: "" }, { hoverPlay: true })}${p.media.kind !== "image" ? `<span class="media-kind">${icon("play", "icon-sm")}Video</span>` : ""}</div>
						<div class="project-body">
							${badge(p.discipline)}
							<h2><a class="stretched" href="#projects/${p.id}">${esc(p.title)}</a></h2>
							<p>${esc(p.desc)}</p>
							${chips(p.tags, "chips-sm")}
						</div>
						<span class="project-open" aria-hidden="true">View details${icon("arrow-right", "icon-sm")}</span>
					</li>`
					)
					.join("")}
			</ul>`;
	}

	// ----- Creative library -----
	const mediaState = {
		filter: "all",
		q: "",
		density: store.get("mediaDensity") === "compact" ? "compact" : "comfortable",
		list: D.media.slice(),
		applyParam(param) {
			if (param === "channels") {
				const ch = $("#channels");
				ch && ch.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
				return;
			}
			const f = param && (param === "all" || CATEGORY_LABEL[param]) ? param : param ? "all" : this.filter;
			if (f !== this.filter || !rendered.media) this.filter = f;
			setMediaFilter(this.filter, false);
		},
	};

	renderers.media = (el) => {
		const counts = countBy(D.media, "category");
		el.innerHTML = `
			<div class="toolbar" role="search">
				<div class="chip-group" role="group" aria-label="Filter by category">
					<button class="filter-chip" data-cat="all" aria-pressed="true">All <span>${D.media.length}</span></button>
					${D.mediaCategories.map((c) => `<button class="filter-chip" data-cat="${c.id}" aria-pressed="false">${esc(c.label)} <span>${counts[c.id] || 0}</span></button>`).join("")}
				</div>
				<label class="search-field">
					${icon("search")}
					<span class="sr-only">Search the library</span>
					<input type="search" id="mediaSearch" placeholder="Search by brand, format…" autocomplete="off" />
				</label>
				<div class="segmented" role="group" aria-label="Density">
					<button data-density="comfortable" aria-pressed="${mediaState.density === "comfortable"}" aria-label="Large tiles">${icon("grid")}</button>
					<button data-density="compact" aria-pressed="${mediaState.density === "compact"}" aria-label="Compact tiles">${icon("list")}</button>
				</div>
			</div>
			<p class="result-count" id="mediaCount" aria-live="polite"></p>
			<div id="mediaResults"></div>

			<section class="section" id="channels" aria-labelledby="h-channels">
				<div class="section-head"><h2 id="h-channels">YouTube channels</h2><p class="muted">Video projects and experiments I've put together outside of client work.</p></div>
				<ul class="channel-grid">
					${D.channels
						.map(
							(c) => `
						<li><a class="card channel" href="${esc(c.url)}" target="_blank" rel="noopener">
							<span class="channel-icon">${icon("youtube")}</span>
							<span class="channel-text"><strong>${esc(c.name)}</strong><small>${esc(c.desc)}</small></span>
							<span class="pill pill-muted">${esc(c.status)}</span>
							${icon("external", "icon-sm muted")}
						</a></li>`
						)
						.join("")}
				</ul>
			</section>`;

		$$("[data-cat]", el).forEach((b) => b.addEventListener("click", () => setMediaFilter(b.getAttribute("data-cat"), true)));
		$("#mediaSearch", el).addEventListener("input", (e) => {
			mediaState.q = e.target.value.trim().toLowerCase();
			drawMedia();
		});
		$$("[data-density]", el).forEach((b) =>
			b.addEventListener("click", () => {
				mediaState.density = b.getAttribute("data-density");
				store.set("mediaDensity", mediaState.density);
				$$("[data-density]", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
				drawMedia();
			})
		);
		el.addEventListener("click", (e) => {
			const tile = e.target.closest("[data-media-index]");
			if (tile) openLightbox(mediaState.list, Number(tile.getAttribute("data-media-index")));
			if (e.target.closest("[data-clear-media]")) {
				mediaState.q = "";
				$("#mediaSearch", el).value = "";
				setMediaFilter("all", true);
			}
		});
		bindHoverPlay(el);
	};

	function setMediaFilter(filter, updateHash) {
		mediaState.filter = filter;
		$$("[data-cat]").forEach((x) => x.setAttribute("aria-pressed", String(x.getAttribute("data-cat") === filter)));
		if (updateHash) history.replaceState(null, "", filter === "all" ? "#media" : `#media/${filter}`);
		drawMedia();
	}

	function drawMedia() {
		const s = mediaState;
		const out = $("#mediaResults");
		if (!out) return;
		s.list = D.media.filter((m) => {
			if (s.filter !== "all" && m.category !== s.filter) return false;
			if (!s.q) return true;
			const hay = [m.title, m.type, m.format, m.brand, CATEGORY_LABEL[m.category]].join(" ").toLowerCase();
			return s.q.split(/\s+/).every((w) => hay.includes(w));
		});
		$("#mediaCount").textContent = `Showing ${s.list.length} of ${plural(D.media.length, "piece")}`;
		if (!s.list.length) {
			out.innerHTML = `<div class="empty">${icon("search")}<h2>Nothing matches “${esc(s.q)}”</h2><p class="muted">Try a brand name like Caviar or a format like email.</p><button class="btn btn-secondary btn-sm" data-clear-media>Reset library</button></div>`;
			return;
		}
		out.innerHTML = `
			<ul class="media-grid ${s.density === "compact" ? "is-compact" : ""}">
				${s.list
					.map(
						(m, i) => `
					<li>
						<button class="media-tile" data-media-index="${i}" data-hover-wrap aria-label="View ${esc(m.title)} (${esc(m.format)})">
							<span class="media-thumb">${thumb({ ...m, title: "" }, { hoverPlay: true })}${m.kind !== "image" ? `<span class="media-kind">${icon("play", "icon-sm")}</span>` : ""}</span>
							<span class="media-caption"><strong>${esc(m.title)}</strong><small>${esc(m.format)}</small></span>
						</button>
					</li>`
					)
					.join("")}
			</ul>`;
	}

	// ----- Services -----
	renderers.services = (el) => {
		el.innerHTML = `
			<ul class="tile-grid">
				${D.services.map((s) => `<li class="card tile"><span class="tile-icon">${icon(s.icon)}</span><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p>${chips(s.tags, "chips-sm")}</li>`).join("")}
			</ul>

			<section class="section" aria-labelledby="h-process">
				<div class="section-head"><h2 id="h-process">How we'll work together</h2><p class="muted">A simple, transparent process from first message to final delivery.</p></div>
				<ol class="stepper">
					${D.process.map((p, i) => `<li class="card step"><span class="step-num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></li>`).join("")}
				</ol>
			</section>

			<aside class="card cta-card">
				<div><h2>Ready when you are</h2><p class="muted">${esc(D.profile.availability)}. ${esc(D.profile.responseTime)}</p></div>
				<a class="btn btn-primary" href="#contact">${icon("send")}Start a project</a>
			</aside>`;
	};

	// ----- Contact -----
	renderers.contact = (el) => {
		const p = D.profile;
		el.innerHTML = `
			<div class="contact-grid">
				<div class="contact-side">
					<article class="card">
						<p class="status-line"><span class="status-dot" aria-hidden="true"></span>Currently available for freelance</p>
						<ul class="info-list">
							<li><span class="tile-icon">${icon("pin")}</span><div><h2>Location</h2><p>Negros Occidental<br />Philippines</p></div></li>
							<li><span class="tile-icon">${icon("mail")}</span><div><h2>Email</h2><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></div><button class="icon-btn" data-copy-email aria-label="Copy email address">${icon("copy")}</button></li>
							<li><span class="tile-icon">${icon("phone")}</span><div><h2>Phone</h2><a href="${esc(p.phoneHref)}">${esc(p.phone)}</a></div></li>
						</ul>
					</article>
					<article class="card">
						${cardHead("Elsewhere")}
						${socialList()}
					</article>
				</div>

				<article class="card form-card">
					${cardHead("Send a message")}
					<form class="contact-form" id="contactForm" novalidate>
						<div class="form-row">
							<div class="field">
								<label for="contact-name">Name</label>
								<input type="text" id="contact-name" name="name" placeholder="Your name" autocomplete="name" required aria-describedby="err-name" />
								<p class="field-error" id="err-name"></p>
							</div>
							<div class="field">
								<label for="contact-email">Email</label>
								<input type="email" id="contact-email" name="email" placeholder="your@email.com" autocomplete="email" required aria-describedby="err-email" />
								<p class="field-error" id="err-email"></p>
							</div>
						</div>
						<div class="field">
							<label for="contact-subject">Subject</label>
							<input type="text" id="contact-subject" name="subject" placeholder="Project inquiry" required aria-describedby="err-subject" />
							<p class="field-error" id="err-subject"></p>
						</div>
						<div class="field">
							<label for="contact-message">Message</label>
							<textarea id="contact-message" name="message" rows="6" placeholder="Tell me about your project..." required aria-describedby="err-message"></textarea>
							<p class="field-error" id="err-message"></p>
						</div>
						<div class="form-foot">
							<button type="submit" class="btn btn-primary">${icon("send")}Send message</button>
							<p class="muted small">${esc(p.responseTime)} Opens your email app.</p>
						</div>
					</form>
				</article>
			</div>

			<aside class="card cta-card cta-card-accent">
				<div><h2>Let's work together.</h2><p>I'm available for freelance work and exciting new projects. Let's collaborate and bring your ideas to life!</p></div>
				<div class="btn-row">
					<a class="btn btn-primary" href="mailto:${esc(p.email)}">${icon("mail")}Send email</a>
					<a class="btn btn-secondary" href="${esc(p.resume)}" download>${icon("download")}Download resume</a>
				</div>
			</aside>`;

		// Contact form: mailto fallback — GitHub Pages has no backend.
		const form = $("#contactForm", el);
		const messages = {
			valueMissing: "This field is required.",
			typeMismatch: "Enter a valid email address.",
		};
		const validate = (input) => {
			const err = $(`#${input.getAttribute("aria-describedby")}`);
			const v = input.validity;
			const msg = v.valid ? "" : v.valueMissing ? messages.valueMissing : messages.typeMismatch;
			err.textContent = msg;
			input.setAttribute("aria-invalid", String(!!msg));
			return !msg;
		};
		$$("input, textarea", form).forEach((i) => i.addEventListener("blur", () => i.value && validate(i)));
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			const fields = $$("input, textarea", form);
			const invalid = fields.filter((f) => !validate(f));
			if (invalid.length) {
				invalid[0].focus();
				return;
			}
			const [name, email, subject, message] = fields.map((f) => f.value);
			const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
			window.location.href = `mailto:${p.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		});
	};

	document.addEventListener("click", (e) => {
		if (e.target.closest("[data-copy-email]")) copyEmail();
	});

	// ===== 7. PROJECT DRAWER =====
	const drawer = $("#projectDrawer");
	const drawerBody = $("#drawerBody");
	const drawerLayer = { close: () => closeDrawer(), el: drawer };
	let drawerProject = null;
	let drawerReturnFocus = null;

	function mediaEmbed(m, title) {
		if (m.kind === "image") return `<button class="drawer-hero-btn" data-hero-zoom aria-label="View ${esc(title)} full size"><img src="${esc(m.src)}" alt="${esc(title)}" /><span class="zoom-hint">${icon("maximize", "icon-sm")}</span></button>`;
		if (m.kind === "video") return `<video src="${esc(m.src)}" poster="${esc(m.poster || "")}" controls playsinline muted ${reducedMotion.matches ? "" : "autoplay"} loop></video>`;
		return `<iframe src="${drivePreview(m.driveId)}" title="${esc(title)} video" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>`;
	}

	function openProject(id) {
		const p = D.projects.find((x) => x.id === id);
		if (!p) {
			history.replaceState(null, "", "#projects");
			return;
		}
		if (drawerProject === p && !drawer.hidden) return;
		const wasOpen = !drawer.hidden;
		drawerProject = p;
		if (!wasOpen) drawerReturnFocus = document.activeElement;

		const gallery = (p.gallery || []).map((src, i) => ({ kind: "image", src, title: `${p.title} — image ${i + 2}` }));
		$("#drawerEyebrow").textContent = p.type;
		drawerBody.innerHTML = `
			<div class="drawer-hero ${p.media.kind === "drive" ? "is-embed" : ""}">${mediaEmbed(p.media, p.title)}</div>
			<div class="drawer-content">
				${badge(p.discipline)}
				<h2 id="drawerTitle">${esc(p.title)}</h2>
				<p class="lead">${esc(p.desc)}</p>
				<dl class="meta-grid">
					<div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
					<div><dt>Discipline</dt><dd>${esc(DISCIPLINES[p.discipline].label)}</dd></div>
					<div><dt>Type</dt><dd>${esc(p.type)}</dd></div>
				</dl>
				<h3 class="subhead">Tags &amp; tools</h3>
				${chips(p.tags)}
				${
					gallery.length
						? `<h3 class="subhead">Gallery <span class="muted">${gallery.length}</span></h3>
					<ul class="gallery">${gallery.map((g, i) => `<li><button data-gallery-index="${i}" aria-label="View ${esc(g.title)}"><img src="${esc(g.src)}" alt="" loading="lazy" /></button></li>`).join("")}</ul>`
						: ""
				}
				${
					p.showChannels
						? `<h3 class="subhead">Channels</h3><ul class="link-list">${D.channels
								.map((c) => `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${icon("youtube")}${esc(c.name)}<span class="pill pill-muted">${esc(c.status)}</span>${icon("external", "icon-sm muted")}</a></li>`)
								.join("")}</ul>`
						: ""
				}
				${p.links ? `<h3 class="subhead">Links</h3><ul class="link-list">${p.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${icon("github")}${esc(l.label)}${icon("external", "icon-sm muted")}</a></li>`).join("")}</ul>` : ""}
				<div class="btn-row">
					${p.related ? `<a class="btn btn-secondary" href="#${p.related.route}/${p.related.filter}">${esc(p.related.label)}${icon("arrow-right")}</a>` : ""}
					<a class="btn btn-primary" href="#contact">${icon("send")}Start a similar project</a>
				</div>
			</div>`;

		$("[data-hero-zoom]", drawerBody)?.addEventListener("click", () => openLightbox([{ ...p.media, title: p.title }, ...gallery], 0));
		$$("[data-gallery-index]", drawerBody).forEach((b) => b.addEventListener("click", () => openLightbox(gallery, Number(b.getAttribute("data-gallery-index")))));

		const list = projectState.list.length ? projectState.list : D.projects;
		const idx = list.indexOf(p);
		$("#drawerPrev").disabled = list.length < 2;
		$("#drawerNext").disabled = list.length < 2;
		drawer.dataset.prev = list[(idx - 1 + list.length) % list.length].id;
		drawer.dataset.next = list[(idx + 1) % list.length].id;

		if (!wasOpen) {
			drawer.hidden = false;
			requestAnimationFrame(() => drawer.classList.add("open"));
			pushLayer(drawerLayer);
		}
		drawerBody.scrollTop = 0;
		$(".drawer-panel [data-close]", drawer).focus();
	}

	function closeDrawer(silent) {
		if (drawer.hidden) return;
		drawer.classList.remove("open");
		drawer.hidden = true;
		drawerBody.innerHTML = ""; // stops any playing media
		drawerProject = null;
		popLayer(drawerLayer);
		if (!silent) {
			history.replaceState(null, "", "#projects");
			if (drawerReturnFocus && document.contains(drawerReturnFocus)) drawerReturnFocus.focus();
		}
	}
	$$("[data-close]", drawer).forEach((b) => b.addEventListener("click", () => closeDrawer()));
	const stepDrawer = (id) => {
		history.replaceState(null, "", `#projects/${id}`);
		openProject(id);
	};
	$("#drawerPrev").addEventListener("click", () => stepDrawer(drawer.dataset.prev));
	$("#drawerNext").addEventListener("click", () => stepDrawer(drawer.dataset.next));
	drawer.addEventListener("keydown", (e) => trapFocus(drawer, e));

	// ===== 8. LIGHTBOX =====
	const lightbox = $("#lightbox");
	const stage = $("#lightboxStage");
	const lbLayer = { close: closeLightbox, el: lightbox };
	const lb = { items: [], index: 0, returnFocus: null };

	function openLightbox(items, index) {
		lb.items = items;
		lb.index = index;
		lb.returnFocus = document.activeElement;
		lightbox.hidden = false;
		lightbox.classList.toggle("single", items.length < 2);
		pushLayer(lbLayer);
		showLightboxItem();
		$("#lightboxClose").focus();
	}

	function showLightboxItem() {
		const m = lb.items[lb.index];
		const title = esc(m.title || "");
		// Same three media types the original lightbox handled: image, local .mp4, Google Drive iframe.
		if (m.kind === "drive" || (m.src && m.src.includes("drive.google.com"))) {
			stage.innerHTML = `<iframe src="${m.driveId ? drivePreview(m.driveId) : esc(m.src)}" title="${title}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
		} else if (m.kind === "video") {
			stage.innerHTML = `<video src="${esc(m.src)}" poster="${esc(m.poster || "")}" controls autoplay playsinline></video>`;
		} else {
			stage.innerHTML = `<img src="${esc(m.src)}" alt="${title}" />`;
		}
		stage.className = `lightbox-stage is-${m.kind}`;
		$("#lightboxCaption").textContent = [m.title, m.format].filter(Boolean).join(" · ");
		$("#lightboxPos").textContent = lb.items.length > 1 ? `${lb.index + 1} / ${lb.items.length}` : "";
	}

	function stepLightbox(dir) {
		if (lb.items.length < 2) return;
		lb.index = (lb.index + dir + lb.items.length) % lb.items.length;
		showLightboxItem();
	}

	function closeLightbox() {
		if (lightbox.hidden) return;
		stage.innerHTML = ""; // stops local video and kills the Drive iframe
		lightbox.hidden = true;
		popLayer(lbLayer);
		if (lb.returnFocus && document.contains(lb.returnFocus)) lb.returnFocus.focus();
	}

	$("#lightboxClose").addEventListener("click", closeLightbox);
	$("#lightboxPrev").addEventListener("click", () => stepLightbox(-1));
	$("#lightboxNext").addEventListener("click", () => stepLightbox(1));
	lightbox.addEventListener("click", (e) => {
		if (e.target === lightbox || e.target === stage) closeLightbox();
	});
	lightbox.addEventListener("keydown", (e) => {
		if (e.key === "ArrowLeft") stepLightbox(-1);
		else if (e.key === "ArrowRight") stepLightbox(1);
		else trapFocus(lightbox, e);
	});
	let touchX = null;
	stage.addEventListener("touchstart", (e) => (touchX = e.changedTouches[0].screenX), { passive: true });
	stage.addEventListener(
		"touchend",
		(e) => {
			if (touchX === null) return;
			const dx = touchX - e.changedTouches[0].screenX;
			if (Math.abs(dx) > 50) stepLightbox(dx > 0 ? 1 : -1);
			touchX = null;
		},
		{ passive: true }
	);

	// ===== 9. COMMAND PALETTE =====
	const palette = $("#palette");
	const pInput = $("#paletteInput");
	const pList = $("#paletteList");
	const paletteLayer = { close: closePalette, el: palette };
	let pResults = [];
	let pActive = 0;
	let pReturnFocus = null;

	const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
	$("#searchKbd").textContent = isMac ? "⌘K" : "Ctrl K";

	const paletteIndex = [
		...$$("[data-view]").map((v) => ({
			type: "Pages",
			title: v.getAttribute("data-title"),
			sub: v.getAttribute("data-group") || "Dashboard",
			ic: $(`.nav-item[data-route="${v.getAttribute("data-view")}"] use`)?.getAttribute("href").slice(3) || "home",
			run: () => go(v.getAttribute("data-view")),
		})),
		{ type: "Actions", title: "Copy email address", sub: D.profile.email, ic: "copy", run: copyEmail },
		{ type: "Actions", title: "Send an email", sub: "Opens your mail app", ic: "mail", run: () => (window.location.href = `mailto:${D.profile.email}`) },
		{ type: "Actions", title: "Open resume (PDF)", sub: "Opens in a new tab", ic: "file", run: () => window.open(D.profile.resume, "_blank", "noopener") },
		{ type: "Actions", title: "Toggle light / dark theme", sub: "Appearance", ic: "sun", run: toggleTheme },
		...D.projects.map((p) => ({ type: "Projects", title: p.title, sub: p.type, keys: p.tags.join(" "), ic: DISCIPLINES[p.discipline].icon, run: () => go(`projects/${p.id}`) })),
		...D.experience.map((e) => ({ type: "Experience", title: e.role, sub: `${e.org} · ${periodLabel(e.start, e.end)}`, ic: "briefcase", run: () => go("experience") })),
		...D.skillGroups.flatMap((g) => g.tags.map((t) => ({ type: "Skills", title: t, sub: g.name, ic: g.icon, run: () => go("skills") }))),
		...D.tools.map((t) => ({ type: "Skills", title: t.name, sub: `Tool · ${t.group}`, ic: "cpu", run: () => go("skills") })),
		...D.media.map((m) => ({
			type: "Creative library",
			title: m.title,
			sub: `${CATEGORY_LABEL[m.category]} · ${m.format}`,
			keys: [m.brand, m.type].join(" "),
			ic: m.kind === "image" ? "image" : "film",
			run: () => {
				mediaState.q = "";
				const ms = $("#mediaSearch");
				if (ms) ms.value = "";
				go(`media/${m.category}`);
				const i = mediaState.list.indexOf(m);
				openLightbox(mediaState.list, Math.max(i, 0));
			},
		})),
		...D.channels.map((c) => ({ type: "Links", title: c.name, sub: "YouTube channel", ic: "youtube", run: () => window.open(c.url, "_blank", "noopener") })),
		...D.socials.map((s) => ({ type: "Links", title: s.label, sub: s.handle, ic: SOCIAL_ICON[s.id], run: () => window.open(s.url, "_blank", "noopener") })),
	];

	function searchPalette(q) {
		q = q.trim().toLowerCase();
		if (!q) return paletteIndex.filter((i) => i.type === "Pages" || i.type === "Actions");
		const words = q.split(/\s+/);
		return paletteIndex
			.map((item) => {
				const title = item.title.toLowerCase();
				const hay = `${title} ${item.sub} ${item.keys || ""} ${item.type}`.toLowerCase();
				if (!words.every((w) => hay.includes(w))) return null;
				const score = title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2;
				return { item, score };
			})
			.filter(Boolean)
			.sort((a, b) => a.score - b.score)
			.slice(0, 40)
			.map((r) => r.item);
	}

	function drawPalette() {
		pResults = searchPalette(pInput.value);
		pActive = 0;
		if (!pResults.length) {
			pList.innerHTML = `<li class="palette-empty" role="presentation">No results for “${esc(pInput.value)}”</li>`;
			pInput.removeAttribute("aria-activedescendant");
			return;
		}
		// Group by type, keeping first-seen group order.
		const groups = [];
		pResults.forEach((r) => {
			let g = groups.find((x) => x.type === r.type);
			if (!g) groups.push((g = { type: r.type, items: [] }));
			g.items.push(r);
		});
		pResults = groups.flatMap((g) => g.items);
		let n = 0;
		pList.innerHTML = groups
			.map(
				(g) =>
					`<li class="palette-group" role="presentation">${esc(g.type)}</li>` +
					g.items
						.map((r) => {
							const i = n++;
							return `<li class="palette-item" role="option" id="pal-${i}" data-i="${i}" aria-selected="false">${icon(r.ic)}<span class="palette-title">${esc(r.title)}</span><span class="palette-sub">${esc(r.sub)}</span></li>`;
						})
						.join("")
			)
			.join("");
		highlight(0);
	}

	function highlight(i) {
		const items = $$(".palette-item", pList);
		if (!items.length) return;
		pActive = (i + items.length) % items.length;
		items.forEach((el, j) => el.setAttribute("aria-selected", String(j === pActive)));
		items[pActive].scrollIntoView({ block: "nearest" });
		pInput.setAttribute("aria-activedescendant", `pal-${pActive}`);
	}

	function runPalette(i) {
		const r = pResults[i];
		if (!r) return;
		closePalette(true);
		r.run();
	}

	function openPalette() {
		if (!palette.hidden) return;
		pReturnFocus = document.activeElement;
		palette.hidden = false;
		pushLayer(paletteLayer);
		pInput.value = "";
		drawPalette();
		pInput.focus();
	}
	function closePalette(skipFocus) {
		if (palette.hidden) return;
		palette.hidden = true;
		popLayer(paletteLayer);
		if (skipFocus !== true && pReturnFocus && document.contains(pReturnFocus)) pReturnFocus.focus();
	}

	$("#searchBtn").addEventListener("click", openPalette);
	$$("[data-close]", palette).forEach((b) => b.addEventListener("click", closePalette));
	pInput.addEventListener("input", drawPalette);
	pInput.addEventListener("keydown", (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			highlight(pActive + 1);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			highlight(pActive - 1);
		} else if (e.key === "Enter") {
			e.preventDefault();
			runPalette(pActive);
		} else if (e.key === "Tab") {
			e.preventDefault();
		}
	});
	pList.addEventListener("click", (e) => {
		const item = e.target.closest(".palette-item");
		if (item) runPalette(Number(item.getAttribute("data-i")));
	});
	pList.addEventListener("pointermove", (e) => {
		const item = e.target.closest(".palette-item");
		if (item && Number(item.getAttribute("data-i")) !== pActive) highlight(Number(item.getAttribute("data-i")));
	});

	// ===== GLOBAL KEYS =====
	document.addEventListener("keydown", (e) => {
		const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
			e.preventDefault();
			palette.hidden ? openPalette() : closePalette();
			return;
		}
		if (e.key === "/" && !typing && palette.hidden) {
			e.preventDefault();
			openPalette();
			return;
		}
		if (e.key === "Escape" && openLayers.length) {
			e.preventDefault();
			openLayers[openLayers.length - 1].close();
		}
	});

	// ===== 10. BOOT =====
	handleRoute();
})();
