// ===== WAIT FOR DOM TO BE FULLY LOADED =====
document.addEventListener("DOMContentLoaded", function () {
	"use strict";

	// ===== TYPEWRITER EFFECT =====
	const typewriterEl = document.querySelector(".typewriter-text");
	if (typewriterEl) {
		const roles = [
			"I'm a Full Stack Developer",
			"I'm a Graphic Designer",
			"I'm a Video Editor",
		];
		let roleIndex = 0;
		let charIndex = 0;
		let isDeleting = false;

		function type() {
			const current = roles[roleIndex];
			if (isDeleting) {
				typewriterEl.textContent = current.substring(0, charIndex - 1);
				charIndex--;
			} else {
				typewriterEl.textContent = current.substring(0, charIndex + 1);
				charIndex++;
			}

			let delay = isDeleting ? 50 : 90;

			if (!isDeleting && charIndex === current.length) {
				delay = 1800;
				isDeleting = true;
				typewriterEl.classList.remove("flash");
				void typewriterEl.offsetWidth; // force reflow
				typewriterEl.classList.add("flash");
			} else if (isDeleting && charIndex === 0) {
				isDeleting = false;
				roleIndex = (roleIndex + 1) % roles.length;
				delay = 400;
			}

			setTimeout(type, delay);
		}

		setTimeout(type, 800);
	}

	// ===== HERO STAT COUNT-UP =====
	document.querySelectorAll(".hero-stat strong").forEach((el) => {
		const raw = el.textContent.trim();
		const num = parseInt(raw);
		if (isNaN(num)) return;
		const suffix = raw.replace(String(num), "");
		let count = 0;
		const duration = 1200;
		const steps = num;
		const interval = duration / steps;
		const timer = setInterval(() => {
			count = Math.min(count + 1, num);
			el.textContent = count + suffix;
			if (count >= num) clearInterval(timer);
		}, interval);
	});

	// ===== SCROLL-TRIGGERED AUTOPLAY IFRAME (Google Drive embeds) =====
	const scrollAutoplayIframes = document.querySelectorAll(".scroll-autoplay-iframe");
	if (scrollAutoplayIframes.length) {
		const iframeObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const iframe = entry.target;
					if (entry.isIntersecting && !iframe.src) {
						iframe.src = iframe.dataset.src;
					}
				});
			},
			{ threshold: 0.5 }
		);
		scrollAutoplayIframes.forEach((iframe) => iframeObserver.observe(iframe));
	}

	// ===== ABOUT STAT COUNT-UP (scroll-triggered) =====
	const aboutStats = document.querySelectorAll(".about-stats .stat-number");
	if (aboutStats.length) {
		const aboutObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				aboutObserver.unobserve(entry.target);
				const el = entry.target;
				const raw = el.getAttribute("data-value") || el.textContent.trim();
				el.setAttribute("data-value", raw);
				const num = parseInt(raw);
				if (isNaN(num)) return;
				const suffix = raw.replace(String(num), "");
				let count = 0;
				const steps = Math.min(num, 60);
				const interval = 1000 / steps;
				const increment = Math.ceil(num / steps);
				const timer = setInterval(() => {
					count = Math.min(count + increment, num);
					el.textContent = count + suffix;
					if (count >= num) clearInterval(timer);
				}, interval);
			});
		}, { threshold: 0.5 });
		aboutStats.forEach((el) => aboutObserver.observe(el));
	}

	// ===== MOBILE MENU TOGGLE =====
	const hamburger = document.querySelector(".hamburger");
	const navMenu = document.querySelector(".nav-menu");
	const navLinks = document.querySelectorAll(".nav-link");

	if (hamburger && navMenu) {
		hamburger.addEventListener("click", () => {
			navMenu.classList.toggle("active");

			// Animate hamburger icon
			const spans = hamburger.querySelectorAll("span");
			if (navMenu.classList.contains("active")) {
				spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
				spans[1].style.opacity = "0";
				spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
			} else {
				spans[0].style.transform = "none";
				spans[1].style.opacity = "1";
				spans[2].style.transform = "none";
			}
		});

		// Close mobile menu when clicking on a link
		navLinks.forEach((link) => {
			link.addEventListener("click", () => {
				navMenu.classList.remove("active");
				const spans = hamburger.querySelectorAll("span");
				spans[0].style.transform = "none";
				spans[1].style.opacity = "1";
				spans[2].style.transform = "none";
			});
		});
	}

	// ===== SMOOTH SCROLLING =====
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute("href"));
			if (target) {
				target.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		});
	});

	// ===== NAVBAR BACKGROUND ON SCROLL =====
	window.addEventListener("scroll", () => {
		const navbar = document.querySelector(".navbar");
		if (navbar) {
			if (window.scrollY > 100) {
				navbar.style.boxShadow = "0 2px 20px rgba(255, 192, 1, 0.2)";
			} else {
				navbar.style.boxShadow = "0 2px 20px rgba(255, 192, 1, 0.1)";
			}
		}
	});

	// ===== SCROLL PROGRESS BAR =====
	const scrollProgressBar = document.createElement('div');
	scrollProgressBar.id = 'scroll-progress';
	document.body.appendChild(scrollProgressBar);
	window.addEventListener('scroll', () => {
		const scrolled = window.scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
		scrollProgressBar.style.width = (scrolled * 100) + '%';
	}, { passive: true });

	// ===== GSAP SCROLL REVEAL ANIMATIONS =====
	// Skip all motion for users who prefer reduced motion
	if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	gsap.registerPlugin(ScrollTrigger);

	ScrollTrigger.defaults({
		start: "top 88%",
		toggleActions: "play none none none",
	});

	// Section headings — word-by-word reveal scrubbed to scroll
	gsap.utils.toArray(".section-title").forEach((el) => {
		const words = el.textContent.trim().split(/\s+/);
		el.innerHTML = words.map(w => `<span class="word-reveal">${w}</span>`).join('');
		const wordSpans = el.querySelectorAll('.word-reveal');
		gsap.fromTo(wordSpans,
			{ opacity: 0.1 },
			{
				opacity: 1,
				stagger: 0.08,
				ease: "none",
				scrollTrigger: {
					trigger: el,
					start: "top 85%",
					end: "top 45%",
					scrub: 1,
				}
			}
		);
	});

	// About section
	gsap.from(".about-text", {
		scrollTrigger: { trigger: ".about-text", once: true },
		opacity: 0,
		y: 20,
		duration: 0.8,
		ease: "power2.out",
		delay: 0.15,
	});
	gsap.from(".about-highlights li", {
		scrollTrigger: { trigger: ".about-highlights", once: true },
		opacity: 0,
		y: 20,
		duration: 0.6,
		ease: "power2.out",
		stagger: 0.1,
	});
	// about-stats stat-items: no fade-in — counter animation handles the entrance effect

	// Skill cards — individual self-triggers (stagger via delay)
	gsap.utils.toArray(".skill-card").forEach((card, i) => {
		gsap.from(card, {
			scrollTrigger: { trigger: card, start: "top 85%", once: true },
			opacity: 0,
			y: 20,
			duration: 0.7,
			ease: "power2.out",
			delay: i * 0.1,
		});
	});

	// Skill progress bars — animate width via ScrollTrigger
	document.querySelectorAll(".skill-card").forEach((card) => {
		const bar = card.querySelector(".skill-progress");
		if (!bar) return;
		const target = bar.getAttribute("data-progress");
		gsap.fromTo(
			bar,
			{ width: "0%" },
			{
				width: target + "%",
				duration: 1.1,
				ease: "power2.out",
				scrollTrigger: {
					trigger: card,
					start: "top 85%",
					once: true,
				},
			}
		);
	});

	// Process cards — individual self-triggers
	gsap.utils.toArray(".process-card").forEach((card, i) => {
		gsap.from(card, {
			scrollTrigger: { trigger: card, start: "top 85%", once: true },
			opacity: 0,
			y: 20,
			duration: 0.65,
			ease: "power2.out",
			delay: i * 0.1,
		});
	});

	// Case study cards — individual self-triggers
	gsap.utils.toArray(".case-study-card").forEach((card, i) => {
		gsap.from(card, {
			scrollTrigger: { trigger: card, start: "top 85%", once: true },
			opacity: 0,
			y: 20,
			duration: 0.65,
			ease: "power2.out",
			delay: i * 0.1,
		});
	});

	// Tool cards — individual self-triggers
	gsap.utils.toArray(".tool-card").forEach((card, i) => {
		gsap.from(card, {
			scrollTrigger: { trigger: card, start: "top 85%", once: true },
			opacity: 0,
			y: 20,
			duration: 0.65,
			ease: "power2.out",
			delay: i * 0.07,
		});
	});

	// Project grid cards — batch visible cards together, no accumulated delay
	ScrollTrigger.batch(".grid-project-card", {
		start: "top 92%",
		once: true,
		onEnter: (batch) => gsap.from(batch, {
			opacity: 0,
			y: 20,
			duration: 0.45,
			ease: "power2.out",
			stagger: 0.05,
		}),
	});

	// Contact info items — individual self-triggers
	gsap.utils.toArray(".info-item").forEach((item, i) => {
		gsap.from(item, {
			scrollTrigger: { trigger: item, start: "top 85%", once: true },
			opacity: 0,
			y: 20,
			duration: 0.65,
			ease: "power2.out",
			delay: i * 0.12,
		});
	});
	gsap.from(".contact-form-wrap", {
		scrollTrigger: { trigger: ".contact-form-wrap", once: true },
		opacity: 0,
		y: 20,
		duration: 0.8,
		ease: "power2.out",
	});
	gsap.from(".contact-cta", {
		scrollTrigger: { trigger: ".contact-cta", once: true },
		opacity: 0,
		y: 20,
		duration: 0.7,
		ease: "power2.out",
	});
	// ===== HERO / ABOUT PARALLAX SCRUB =====
	// Layered depth effect: background orbs move slowest, content mid-speed,
	// scroll cue fastest (and fades out). Desktop-only — mobile keeps everything
	// static to avoid scroll jank, matching the existing 768px breakpoint.
	let mm = gsap.matchMedia();
	mm.add("(min-width: 769px)", () => {

		// Background layer — ambient orbs drift slowest (~0.4x of the content layer below)
		gsap.to(".hero-orb-wrap-1", {
			y: -50,
			ease: "none",
			scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 1 }
		});
		gsap.to(".hero-orb-wrap-2", {
			y: -75,
			ease: "none",
			scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 1 }
		});

		// Midground — hero content lifts as you scroll away (no opacity — avoids blank on scroll-back)
		gsap.to(".hero-content", {
			y: -130,
			ease: "none",
			scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 1 }
		});

		// Foreground — scroll cue moves fastest and fades out first
		gsap.to(".hero-scroll", {
			y: -170,
			xPercent: -50,
			opacity: 0,
			ease: "none",
			scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 1 }
		});

		// About image drifts against the static surrounding text for depth
		gsap.to(".about-image", {
			y: -100,
			ease: "none",
			scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 1 }
		});

	});

	// ===== STATS COUNT-UP =====
	function animateCounter(el) {
		const text = el.textContent.trim();
		const match = text.match(/^(\d+)(.*)$/);
		if (!match) return; // Skip non-numeric values like "3-in-1"
		const target = parseInt(match[1]);
		const suffix = match[2];
		const obj = { val: 0 };
		gsap.to(obj, {
			val: target,
			duration: 1.5,
			ease: "power2.out",
			onUpdate() {
				el.textContent = Math.round(obj.val) + suffix;
			},
			scrollTrigger: {
				trigger: el,
				start: "top 85%",
				toggleActions: "play none none none",
				once: true,
			}
		});
	}
	document.querySelectorAll('.hero-stat strong').forEach(animateCounter);
	document.querySelectorAll('.stat-number').forEach(animateCounter);

	} // end prefers-reduced-motion check

	// ===== CAROUSEL =====
	const track = document.getElementById("carouselTrack");
	const slides = document.querySelectorAll(".project-card");
	const nextBtn = document.getElementById("nextBtn");
	const prevBtn = document.getElementById("prevBtn");
	const indicators = document.querySelectorAll(".indicator");

	if (track && slides.length > 0 && nextBtn && prevBtn) {
		let currentSlide = 0;
		const totalSlides = slides.length;
		let autoplayInterval;

		console.log("✅ Carousel initialized with", totalSlides, "slides");

		function updateSlide() {
			const offset = -(currentSlide * 100);
			track.style.transform = `translateX(${offset}%)`;

			indicators.forEach((dot, index) => {
				if (index === currentSlide) {
					dot.classList.add("active");
				} else {
					dot.classList.remove("active");
				}
			});
		}

		function nextSlide() {
			currentSlide = (currentSlide + 1) % totalSlides;
			updateSlide();
		}

		function prevSlide() {
			currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
			updateSlide();
		}

		function goToSlide(index) {
			currentSlide = index;
			updateSlide();
		}

		function startAutoplay() {
			stopAutoplay();
			autoplayInterval = setInterval(nextSlide, 5000);
		}

		function stopAutoplay() {
			if (autoplayInterval) {
				clearInterval(autoplayInterval);
			}
		}

		function resetAutoplay() {
			stopAutoplay();
			startAutoplay();
		}

		nextBtn.addEventListener("click", (e) => {
			e.preventDefault();
			nextSlide();
			resetAutoplay();
		});

		prevBtn.addEventListener("click", (e) => {
			e.preventDefault();
			prevSlide();
			resetAutoplay();
		});

		indicators.forEach((dot, index) => {
			dot.addEventListener("click", (e) => {
				e.preventDefault();
				goToSlide(index);
				resetAutoplay();
			});
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft") {
				prevSlide();
				resetAutoplay();
			} else if (e.key === "ArrowRight") {
				nextSlide();
				resetAutoplay();
			}
		});

		let touchStartX = 0;
		let touchEndX = 0;

		track.addEventListener(
			"touchstart",
			(e) => {
				touchStartX = e.changedTouches[0].screenX;
			},
			{ passive: true }
		);

		track.addEventListener(
			"touchend",
			(e) => {
				touchEndX = e.changedTouches[0].screenX;
				const diff = touchStartX - touchEndX;
				if (Math.abs(diff) > 50) {
					if (diff > 0) {
						nextSlide();
					} else {
						prevSlide();
					}
					resetAutoplay();
				}
			},
			{ passive: true }
		);

		const carouselContainer = document.querySelector(".carousel-container");
		if (carouselContainer) {
			carouselContainer.addEventListener("mouseenter", stopAutoplay);
			carouselContainer.addEventListener("mouseleave", startAutoplay);
		}

		updateSlide();
		startAutoplay();
	}

	// ===== CATEGORY FILTER: grid for "All", fanned pile per category =====
	const filterButtons = document.querySelectorAll(".category-card");
	const projectsGrid = document.querySelector(".projects-grid");
	const fanStageWrap = document.getElementById("fanStageWrap");
	const fanStage = document.getElementById("fanStage");
	// Captured once, in original document order — the single source of truth
	// for where each project card belongs, regardless of which view (grid or
	// fan) currently holds the node.
	const allProjectCards = Array.from(document.querySelectorAll(".grid-project-card"));

	const FAN_ANGLE_STEP = 6; // degrees between adjacent cards — fixed, so the
	// fan stays legible whether a category has 3 cards or 18. Total spread
	// grows with the card count instead of being squeezed into one range.
	const FAN_MAX_LIFT = 8; // px the center card lifts above the outer cards

	function layoutFan(cards) {
		const total = cards.length;
		const center = (total - 1) / 2;
		const maxOffset = center || 1;

		cards.forEach((card, index) => {
			const offset = index - center;
			const rot = offset * FAN_ANGLE_STEP;
			const ty = -FAN_MAX_LIFT * (1 - Math.abs(offset) / maxOffset);

			card.classList.add("fan-card");
			card.classList.remove("hide");
			card.style.display = "";
			card.style.setProperty("--rot", `${rot.toFixed(2)}deg`);
			card.style.setProperty("--ty", `${ty.toFixed(2)}px`);
			card.style.setProperty("--z", index + 1);
			fanStage.appendChild(card);
		});
	}

	function showAllCategory() {
		allProjectCards.forEach((card) => {
			card.classList.remove("fan-card", "hide");
			card.style.display = "";
			card.style.removeProperty("--rot");
			card.style.removeProperty("--ty");
			card.style.removeProperty("--z");
			projectsGrid.appendChild(card);
		});

		projectsGrid.style.display = "";
		projectsGrid.classList.remove("is-filtered-grid");
		fanStageWrap.classList.remove("active");
	}

	function showSingleCategory(filterValue) {
		const matching = [];

		allProjectCards.forEach((card) => {
			if (card.getAttribute("data-category") === filterValue) {
				matching.push(card);
			} else if (card.parentElement !== projectsGrid) {
				card.classList.remove("fan-card");
				projectsGrid.appendChild(card);
			}
		});

		projectsGrid.style.display = "none";
		projectsGrid.classList.remove("is-filtered-grid");
		fanStageWrap.classList.add("active");
		layoutFan(matching);
	}

	// Clicking the fanned stack expands it into a grid of just that category,
	// mirroring the "All" grid layout instead of the cramped fan.
	function expandCategoryGrid(filterValue) {
		const matching = [];
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		allProjectCards.forEach((card) => {
			const isMatch = card.getAttribute("data-category") === filterValue;

			card.classList.remove("fan-card");
			card.style.removeProperty("--rot");
			card.style.removeProperty("--ty");
			card.style.removeProperty("--z");
			card.style.removeProperty("--scale");

			if (isMatch) {
				card.classList.remove("hide");
				card.style.display = "";
				matching.push(card);
			} else {
				card.classList.add("hide");
			}

			projectsGrid.appendChild(card);
		});

		fanStageWrap.classList.remove("active");
		projectsGrid.classList.add("is-filtered-grid");
		projectsGrid.style.display = "";

		if (!reducedMotion && typeof gsap !== "undefined") {
			gsap.fromTo(
				matching,
				{ opacity: 0, y: 24, scale: 0.94 },
				{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "transform" }
			);
		}
	}

	if (fanStage) {
		const activateStack = () => {
			if (!fanStageWrap.classList.contains("active")) return;
			const activeButton = document.querySelector(".category-card.active");
			const filterValue = activeButton && activeButton.getAttribute("data-filter");
			if (filterValue && filterValue !== "all") {
				expandCategoryGrid(filterValue);
			}
		};

		fanStage.addEventListener("click", activateStack);
		fanStage.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				activateStack();
			}
		});
	}

	filterButtons.forEach((button) => {
		button.addEventListener("click", () => {
			// Remove active state from all cards
			filterButtons.forEach((btn) => {
				btn.classList.remove("active");
				btn.setAttribute("aria-pressed", "false");
			});

			// Mark clicked card as active
			button.classList.add("active");
			button.setAttribute("aria-pressed", "true");

			const filterValue = button.getAttribute("data-filter");

			if (filterValue === "all") {
				showAllCategory();
			} else {
				showSingleCategory(filterValue);
			}
		});
	});

	// ===== VIEW ALL PROJECTS MODAL =====
	const categorizedWork = document.getElementById("categorizedWork");
	const viewAllProjectsBtn = document.getElementById("viewAllProjectsBtn");
	const projectsModalClose = document.getElementById("projectsModalClose");

	function openProjectsModal() {
		categorizedWork.classList.add("expanded");
		document.body.style.overflow = "hidden";
	}

	function closeProjectsModal() {
		categorizedWork.classList.remove("expanded");
		document.body.style.overflow = "";

		// Reset back to "All" so the collapsed preview grid is whole again —
		// otherwise whichever category was fanned out stays parked outside
		// .projects-grid and the preview would be missing those cards.
		const allButton = document.querySelector('.category-card[data-filter="all"]');
		if (allButton && !allButton.classList.contains("active")) {
			allButton.click();
		}
	}

	if (viewAllProjectsBtn && categorizedWork) {
		viewAllProjectsBtn.addEventListener("click", openProjectsModal);
	}

	if (projectsModalClose && categorizedWork) {
		projectsModalClose.addEventListener("click", closeProjectsModal);
	}

	document.addEventListener("keydown", (e) => {
		if (
			e.key === "Escape" &&
			categorizedWork &&
			categorizedWork.classList.contains("expanded")
		) {
			closeProjectsModal();
		}
	});

	// ===== LIGHTBOX FUNCTIONALITY =====
	console.log("🔍 Initializing lightbox...");

	// Create lightbox HTML with both image and video support
	const lightboxHTML = `
	<div class="lightbox" id="lightbox">
		<div class="lightbox-content">
			<button class="lightbox-close" id="lightboxClose">&times;</button>
			<img src="" alt="" class="lightbox-image" id="lightboxImage" style="display: none;">
			<video controls class="lightbox-video" id="lightboxVideo" style="display: none;">
				<source src="" type="video/mp4">
				Your browser does not support the video tag.
			</video>
			<iframe class="lightbox-iframe" id="lightboxIframe" style="display: none;" allow="autoplay"></iframe>
			<div class="lightbox-info" id="lightboxInfo">
				<h4></h4>
			</div>
		</div>
	</div>
`;

	document.body.insertAdjacentHTML("beforeend", lightboxHTML);

	const lightbox = document.getElementById("lightbox");
	const lightboxImage = document.getElementById("lightboxImage");
	const lightboxVideo = document.getElementById("lightboxVideo");
	const lightboxIframe = document.getElementById("lightboxIframe");
	const lightboxClose = document.getElementById("lightboxClose");
	const lightboxInfo = document.getElementById("lightboxInfo");

	console.log("Lightbox elements:", {
		lightbox: !!lightbox,
		lightboxImage: !!lightboxImage,
		lightboxVideo: !!lightboxVideo,
		lightboxClose: !!lightboxClose,
		lightboxInfo: !!lightboxInfo,
	});

	// Get all view image buttons
	const viewButtons = document.querySelectorAll(".view-image-btn");
	console.log("✅ Found", viewButtons.length, "view buttons");

	// Add click event to each button
	// Add click event to each button
	viewButtons.forEach((button, index) => {
		button.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();

			const projectCard = button.closest(".grid-project-card");
			const image = projectCard.querySelector(".grid-project-image img");
			const video = projectCard.querySelector(".grid-project-image video");
			const iframe = projectCard.querySelector(".grid-project-image iframe"); // New selector
			const projectTitle = projectCard.querySelector(".grid-project-info h4");

			// RESET: Hide everything first
			lightboxImage.style.display = "none";
			lightboxVideo.style.display = "none";
			lightboxIframe.style.display = "none";

			// 1. Handle Google Drive / Iframe
			if (iframe) {
				lightboxIframe.style.display = "block";
				lightboxIframe.src = iframe.src; // Keep the /preview link

				if (projectTitle) {
					lightboxInfo.querySelector("h4").textContent =
						projectTitle.textContent;
				}
				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";
			}
			// 2. Handle Local Video
			else if (video) {
				lightboxVideo.style.display = "block";
				const videoSource = lightboxVideo.querySelector("source");
				videoSource.src = video.src;
				lightboxVideo.load();
				lightboxVideo.play();

				if (projectTitle) {
					lightboxInfo.querySelector("h4").textContent =
						projectTitle.textContent;
				}
				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";
			}
			// 3. Handle Images
			else if (image) {
				lightboxImage.style.display = "block";
				lightboxImage.src = image.src;

				if (projectTitle) {
					lightboxInfo.querySelector("h4").textContent =
						projectTitle.textContent;
				}
				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";
			}
		});
	});

	// Close lightbox function
	function closeLightbox() {
		lightbox.classList.remove("active");
		document.body.style.overflow = "";

		// 1. Pause and reset local video if it was playing
		if (lightboxVideo) {
			lightboxVideo.pause();
			lightboxVideo.currentTime = 0;
		}

		// 2. STOP the Google Drive iframe video
		// Setting the src to an empty string kills the process immediately
		if (lightboxIframe) {
			lightboxIframe.src = "";
		}

		console.log("🔒 Lightbox closed and media stopped");
	}

	if (lightboxClose) {
		lightboxClose.addEventListener("click", closeLightbox);
	}

	if (lightbox) {
		lightbox.addEventListener("click", function (e) {
			if (e.target === lightbox) {
				closeLightbox();
			}
		});
	}

	document.addEventListener("keydown", function (e) {
		if (
			e.key === "Escape" &&
			lightbox &&
			lightbox.classList.contains("active")
		) {
			closeLightbox();
		}
	});
	// ===== CAROUSEL LIGHTBOX FUNCTIONALITY =====
	console.log("🔍 Initializing carousel lightbox...");

	// Get all carousel view buttons (eye icon + arrow link)
	const carouselViewButtons = document.querySelectorAll(".carousel-view-btn, .project-arrow-link");
	console.log("✅ Found", carouselViewButtons.length, "carousel view buttons");

	// Add click event to each carousel button
	carouselViewButtons.forEach((button, index) => {
		console.log(`Adding listener to carousel button ${index + 1}`);
		button.addEventListener("click", function (e) {
			console.log("🖱️ Carousel button clicked!");
			e.preventDefault();
			e.stopPropagation();

			const projectCard = button.closest(".project-card");
			const image = projectCard.querySelector(".project-image img");
			const video = projectCard.querySelector(".project-image video"); // ✅ Also look for video
			const iframe = projectCard.querySelector(".project-image iframe");
			const projectTitle = projectCard.querySelector(".project-content h3");

			console.log("Carousel project card:", projectCard);
			console.log("Image found:", !!image);
			console.log("Video found:", !!video); // ✅ Log video
			console.log("Iframe found:", !!iframe);

			// Get existing lightbox elements
			const lightbox = document.getElementById("lightbox");
			const lightboxImage = document.getElementById("lightboxImage");
			const lightboxVideo = document.getElementById("lightboxVideo");
			const lightboxIframe = document.getElementById("lightboxIframe");
			const lightboxInfo = document.getElementById("lightboxInfo");

			// Check if it's an iframe, video, or image
			if (iframe) {
				// ✅ Handle Google Drive iframe embed
				const iframeSrc = iframe.src || iframe.dataset.src;
				console.log("🎞️ Opening carousel iframe:", iframeSrc);

				lightboxImage.style.display = "none";
				lightboxVideo.style.display = "none";
				lightboxIframe.style.display = "block";
				lightboxIframe.src = iframeSrc;

				if (projectTitle) {
					lightboxInfo.querySelector("h4").textContent =
						projectTitle.textContent;
				}

				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";

				console.log("🎞️ Carousel iframe lightbox opened!");
			} else if (video) {
				// ✅ Handle video
				console.log("📹 Opening carousel video:", video.src);

				// Hide image, show video
				lightboxImage.style.display = "none";
				lightboxVideo.style.display = "block";

				// Set video source
				const videoSource = lightboxVideo.querySelector("source");
				videoSource.src = video.src;
				lightboxVideo.load();

				// ✅ AUTOPLAY the video after it loads
				lightboxVideo.addEventListener(
					"loadeddata",
					function () {
						lightboxVideo.play();
					},
					{ once: true }
				);

				// Set title
				if (projectTitle) {
					lightboxInfo.querySelector("h4").textContent =
						projectTitle.textContent;
				}

				// Show lightbox
				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";

				console.log("📹 Carousel video lightbox opened!");
			} else if (image) {
				// ✅ Handle image
				console.log("📷 Opening carousel image:", image.src);

				// Hide video, show image
				lightboxVideo.style.display = "none";
				lightboxImage.style.display = "block";

				// Set image source
				lightboxImage.src = image.src;
				lightboxImage.alt = image.alt || "";

				// Set title
				if (projectTitle) {
					lightboxInfo.querySelector("h4").textContent =
						projectTitle.textContent;
				}

				// Show lightbox
				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";

				console.log("📷 Carousel image lightbox opened!");
			} else {
				console.error("❌ No image or video found in carousel!");
			}
		});
	});

	// ===== BACK TO TOP =====
	const backToTopBtn = document.getElementById('backToTop');
	if (backToTopBtn) {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 400) {
				backToTopBtn.classList.add('visible');
			} else {
				backToTopBtn.classList.remove('visible');
			}
		});
		backToTopBtn.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	// ===== CONTACT FORM (mailto fallback — no backend on GitHub Pages) =====
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', function (e) {
			e.preventDefault();
			const name = contactForm.querySelector('#contact-name').value;
			const email = contactForm.querySelector('#contact-email').value;
			const subject = contactForm.querySelector('#contact-subject').value;
			const message = contactForm.querySelector('#contact-message').value;

			const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
			const mailtoUrl = `mailto:cyberjhop@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
			window.location.href = mailtoUrl;
		});
	}

});
