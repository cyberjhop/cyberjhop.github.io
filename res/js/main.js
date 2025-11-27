// ===== WAIT FOR DOM TO BE FULLY LOADED =====
document.addEventListener("DOMContentLoaded", function () {
	"use strict";

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

	// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
	const observerOptions = {
		threshold: 0.1,
		rootMargin: "0px 0px -50px 0px",
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = "1";
				entry.target.style.transform = "translateY(0)";

				// Animate skill bars
				if (entry.target.classList.contains("skill-card")) {
					const progressBar = entry.target.querySelector(".skill-progress");
					const progress = progressBar.getAttribute("data-progress");
					setTimeout(() => {
						progressBar.style.width = progress + "%";
					}, 200);
				}

				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe all animated elements
	document
		.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .skill-card")
		.forEach((el) => {
			observer.observe(el);
		});

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

	// ===== CATEGORY FILTER FUNCTIONALITY =====
	const filterButtons = document.querySelectorAll(".filter-btn");
	const projectCards = document.querySelectorAll(".grid-project-card");

	filterButtons.forEach((button) => {
		button.addEventListener("click", () => {
			// Remove active class from all buttons
			filterButtons.forEach((btn) => btn.classList.remove("active"));

			// Add active class to clicked button
			button.classList.add("active");

			const filterValue = button.getAttribute("data-filter");

			projectCards.forEach((card) => {
				const category = card.getAttribute("data-category");

				if (filterValue === "all" || category === filterValue) {
					// Show card
					card.classList.remove("hide");
					card.style.display = "block";
				} else {
					// Hide card
					card.classList.add("hide");
				}
			});
		});
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
	viewButtons.forEach((button, index) => {
		console.log(`Adding listener to button ${index + 1}`);
		button.addEventListener("click", function (e) {
			console.log("🖱️ Button clicked!");
			e.preventDefault();
			e.stopPropagation();

			const projectCard = button.closest(".grid-project-card");
			const image = projectCard.querySelector(".grid-project-image img");
			const video = projectCard.querySelector(".grid-project-image video");
			const projectTitle = projectCard.querySelector(".grid-project-info h4");

			console.log("Project card:", projectCard);
			console.log("Image found:", !!image);
			console.log("Video found:", !!video);

			// Check if it's a video or image
			if (video) {
				// It's a video
				console.log("📹 Opening video:", video.src);

				// Hide image, show video
				lightboxImage.style.display = "none";
				lightboxVideo.style.display = "block";

				// Set video source
				lightboxVideo.querySelector("source").src = video.src;
				lightboxVideo.load(); // Important: reload the video

				// Set title
				if (projectTitle) {
					lightboxInfo.querySelector("h4").textContent =
						projectTitle.textContent;
				}

				// Show lightbox
				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";

				console.log("📹 Video lightbox opened!");
			} else if (image) {
				// It's an image
				console.log("📷 Opening image:", image.src);

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

				console.log("📷 Image lightbox opened!");
			} else {
				console.error("❌ No image or video found!");
			}
		});
	});

	// Close lightbox function
	function closeLightbox() {
		lightbox.classList.remove("active");
		document.body.style.overflow = "";

		// Pause and reset video if it was playing
		if (lightboxVideo) {
			lightboxVideo.pause();
			lightboxVideo.currentTime = 0;
		}

		console.log("🔒 Lightbox closed");
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
});
