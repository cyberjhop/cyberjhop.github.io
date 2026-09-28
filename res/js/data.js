/* =========================================================================
   PORTFOLIO DATA
   All portfolio content lives here, separate from presentation.
   main.js renders every view from this object — add a project, media
   item, role or tool here and it appears across the dashboard
   (lists, counts, charts and the ⌘K search) automatically.

   Media kinds:
     image — local image file (src)
     video — local .mp4 file (src) + poster frame (poster, a small JPEG in
           projects/video/posters/ — generate one with
           ffmpeg -ss 1 -i in.mp4 -frames:v 1 -vf "scale='min(640,iw)':-2" -q:v 5 out.jpg)
     drive — Google Drive file (driveId); large videos live on Drive and are
             embedded via https://drive.google.com/file/d/<id>/preview
   ========================================================================= */
window.PORTFOLIO = {
	profile: {
		name: "Jhop",
		fullName: "Jofil Consulta",
		headline: "IT Specialist · Developer · Creative",
		roles: ["Full Stack Developer", "Graphic Designer", "Video Editor"],
		tagline:
			"I build high-converting digital experiences — from responsive web apps and branded graphics to polished video ads.",
		intro: "Hi! I'm a one-man department — I handle almost everything a project needs, end to end.",
		outro:
			"I work across multiple disciplines so you get a single, reliable collaborator for your digital needs — no juggling multiple freelancers.",
		summary:
			"IT Professional with expertise in software development, graphic design, video editing, and more. Skilled in problem-solving and staying current with emerging technologies to deliver innovative solutions that align with both technical and business goals.",
		highlights: [
			"Responsive web development with Vue.js, Laravel & PHP",
			"Graphic design — Meta ads, email campaigns, product showcases",
			"Video editing — long-form, shorts, UGC & ad creative",
			"Workflow automation with n8n, Make & Zapier",
		],
		personalSkills:
			"Good written and verbal communication skills. Highly organized and efficient to work, can work independently or as part of the team. Proven leadership skills and ability to motivate. Ability to produce best result in pressure situation, always thinking outside of the box. Multitalented, eager to learn and innovate things.",
		softSkills: ["Organized", "Communication", "Teamwork", "Meeting deadlines", "Creativity", "Leadership"],
		location: "Negros Occidental, Philippines",
		email: "cyberjhop@gmail.com",
		phone: "0927 134 8867",
		phoneHref: "tel:09271348867",
		photo: "img/profile.png",
		resume: "res/resume/resume.pdf",
		availability: "Available for freelance work",
		responseTime: "I typically reply within 24 hours.",
	},

	// Self-reported figures, exactly as stated on the original portfolio.
	stats: [
		{ value: "7+", label: "Years experience" },
		{ value: "20+", label: "Projects delivered" },
		{ value: "3-in-1", label: "Dev · Design · Video" },
	],

	socials: [
		{ id: "github", label: "GitHub", handle: "jhop-xocdr", url: "https://github.com/jhop-xocdr" },
		{ id: "linkedin", label: "LinkedIn", handle: "Jofil Consulta", url: "https://www.linkedin.com/in/jofil-consulta-85502b249/" },
		{ id: "x", label: "X / Twitter", handle: "@jhop_ph", url: "https://x.com/jhop_ph" },
		{ id: "instagram", label: "Instagram", handle: "@cyberjhop06", url: "https://www.instagram.com/cyberjhop06/" },
	],

	channels: [
		{ name: "VSAnimeZone", url: "https://www.youtube.com/@VSAnimeZone", desc: "Anime edits and AMV-style content.", status: "Not active" },
		{ name: "Heartbit Official", url: "https://www.youtube.com/@heartbit-official", desc: "Music and creative video uploads.", status: "Not active" },
	],

	// Source: res/resume/resume.pdf. end: null = present.
	experience: [
		{
			org: "Exocoder Inc.",
			role: "Software Engineer, IT Trainer, Graphic Designer, Video Editor",
			start: 2023,
			end: null,
			desc: "I manage the company's social media platforms and teach students how to code. My work primarily focuses on developing web applications.",
			tags: ["Development", "Training", "Design", "Video"],
		},
		{
			org: "Fellowship Baptist College",
			role: "Educator — High School Department",
			start: 2021,
			end: 2023,
			desc: "I teach various programming languages as well as graphic design, including Photoshop and Illustrator. Additionally, I manage departmental work, including ICT.",
			tags: ["Teaching", "Programming", "Design"],
		},
		{
			org: "Magsaha Elementary School",
			role: "Administrative Assistant",
			start: 2021,
			end: 2021,
			desc: "My role is purely technical for the school, and I am responsible for planning the school's entire budget (MOOE), as well as handling other paperwork delegated to me by the principal.",
			tags: ["Administration", "Budgeting"],
		},
		{
			org: "Fellowship Baptist College",
			role: "IT Department — Working Student",
			start: 2017,
			end: 2020,
			desc: "I work on repairing devices in various college departments, both hardware and software. I also handle network connectivity issues in the school whenever problems arise.",
			tags: ["IT Support", "Hardware", "Networking"],
		},
	],

	education: [
		{ level: "Tertiary", school: "Fellowship Baptist College", degree: "Bachelor of Science in Information Technology", place: "Rizal St., Brgy. 9, Kabankalan City, Negros Occidental", start: 2015, end: 2020 },
		{ level: "Secondary", school: "Binicuil National High School", place: "Binicuil, Kabankalan City, Negros Occidental", start: 2011, end: 2015 },
		{ level: "Primary", school: "Binicuil Elementary School", place: "Binicuil, Kabankalan City, Negros Occidental", start: 2005, end: 2011 },
	],

	// Levels and percentages are the ones stated on the original portfolio.
	skillGroups: [
		{
			id: "dev",
			name: "Web Development",
			icon: "code",
			level: "Expert",
			progress: 90,
			tags: ["HTML", "CSS", "JavaScript", "Vue.js", "Bootstrap", "Laravel", "PHP", "MySQL"],
		},
		{
			id: "media",
			name: "Multimedia",
			icon: "image",
			level: "Advanced",
			progress: 85,
			tags: ["Graphic Design", "Video Editing", "Image Manipulation", "Image to Video", "Voice Over", "Storytelling", "Hook Writing", "A/B Testing"],
		},
		{
			id: "auto",
			name: "Automations",
			icon: "target",
			level: "Proficient",
			progress: 80,
			tags: ["n8n", "Make", "Zapier"],
		},
	],

	// Additional technical skills listed on the resume.
	otherSkills: ["Networking", "IT service management (hardware, software)", "Spreadsheets (Excel, Google Sheets)", "Office Suite", "Social media management", "Mobile & desktop software"],

	toolGroups: ["Development", "Design", "Video", "AI", "Automation", "Workspace"],

	tools: [
		{ name: "VS Code", group: "Development", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
		{ name: "Git & GitHub", group: "Development", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
		{ name: "Figma", group: "Design", icon: '<svg viewBox="0 0 39 57" fill="none"><path d="M19.5 0H9.75C4.365 0 0 4.365 0 9.75C0 15.135 4.365 19.5 9.75 19.5H19.5V0Z" fill="#F24E1E"/><path d="M19.5 0H29.25C34.635 0 39 4.365 39 9.75C39 15.135 34.635 19.5 29.25 19.5H19.5V0Z" fill="#A259FF"/><path d="M19.5 19.5H9.75C4.365 19.5 0 23.865 0 29.25C0 34.635 4.365 39 9.75 39H19.5V19.5Z" fill="#FF7262"/><path d="M9.75 39C4.365 39 0 43.365 0 48.75C0 54.135 4.365 58.5 9.75 58.5C15.135 58.5 19.5 54.135 19.5 48.75C19.5 43.365 15.135 39 9.75 39Z" fill="#0ACF83"/><path d="M29.25 39C23.865 39 19.5 43.365 19.5 48.75C19.5 54.135 23.865 58.5 29.25 58.5C34.635 58.5 39 54.135 39 48.75C39 43.365 34.635 39 29.25 39Z" fill="#1ABCFE"/></svg>' },
		{ name: "Photoshop", group: "Design", icon: '<svg viewBox="0 0 128 128"><rect width="128" height="128" rx="24" fill="#001E36"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="72" fill="#31A8FF">Ps</text></svg>' },
		{ name: "Canva", group: "Design", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 13.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5"/><path d="M12 3v13"/><path d="M8 7l4-4 4 4"/><path d="M8 12H5a2 2 0 0 0-2 2v1"/><path d="M16 12h3a2 2 0 0 1 2 2v1"/></svg>' },
		{ name: "CapCut", group: "Video", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>' },
		{ name: "Claude", group: "AI", icon: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#D97757"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-size="13" font-weight="bold" fill="white">A</text></svg>' },
		{ name: "Gemini", group: "AI", icon: '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#1A73E8"/><path d="M24 6 L27.5 18 L40 18 L30 26 L33.5 38 L24 30 L14.5 38 L18 26 L8 18 L20.5 18 Z" fill="white"/></svg>' },
		{ name: "ChatGPT", group: "AI", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
		{ name: "n8n", group: "Automation", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>' },
		{ name: "Make", group: "Automation", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>' },
		{ name: "Zapier", group: "Automation", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
		{ name: "ClickUp", group: "Workspace", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' },
		{ name: "Notion", group: "Workspace", icon: '<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="14" fill="#000"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="60" fill="#FFF">N</text></svg>' },
		{ name: "Slack", group: "Workspace", img: "projects/logo/slack-svgrepo-com.svg" },
	],

	services: [
		{ icon: "code", title: "Web Development", desc: "Clean, modern web solutions — from conversion-focused landing pages to full-featured applications built with Vue.js and Laravel.", tags: ["Vue.js", "Laravel", "PHP", "MySQL"] },
		{ icon: "image", title: "Graphic Design", desc: "Eye-catching Meta ad creatives, email campaigns and product showcases designed to stop the scroll and drive conversions.", tags: ["Meta Ads", "Email", "Product Showcase"] },
		{ icon: "film", title: "Video Editing", desc: "Long-form edits, Shorts & Reels, UGC and ad creative — paced, hooked and cut for the platform it runs on.", tags: ["Ads", "UGC", "Shorts", "Long form"] },
		{ icon: "youtube", title: "YouTube Content Assistance", desc: "Full-service YouTube support — long-form edits, Shorts, scroll-stopping thumbnails, and content strategy aligned with current trends.", tags: ["Thumbnails", "Content Strategy"] },
		{ icon: "sparkles", title: "AI Content Creation", desc: "Leveraging AI tools to generate fast, on-brand content — from text-to-image visuals to image-to-video animations that scale creative output.", tags: ["Text to Image", "Image to Video"] },
		{ icon: "workflow", title: "Workflow Automation", desc: "Connecting the tools you already use with n8n, Make and Zapier so repetitive work runs itself.", tags: ["n8n", "Make", "Zapier"] },
	],

	values: [
		{ icon: "sun", title: "Purposeful Design", desc: "Every visual decision has a reason — whether it's a layout, a color, or a cut. I design with intent, not decoration." },
		{ icon: "activity", title: "Clean Execution", desc: "From code structure to video timelines, I keep things organized and maintainable — not just functional on the surface." },
		{ icon: "clock", title: "Reliable Delivery", desc: "Deadlines aren't suggestions. I communicate early if something shifts and make sure deliverables land when they're expected." },
		{ icon: "users", title: "Brand Alignment", desc: "I take time to understand who you're talking to. The work should feel like you — not like a generic template." },
		{ icon: "layers", title: "Multi-Discipline Edge", desc: "Design, development, and video under one roof means fewer handoffs, more consistency, and a unified creative vision." },
		{ icon: "pen", title: "Attention to Detail", desc: "The small things matter — spacing, transitions, sound design, hover states. I sweat the details so the final output feels polished." },
	],

	process: [
		{ title: "Discover", desc: "We hop on a quick call or message thread to talk through your goals, budget, and timeline — no obligation, no pressure." },
		{ title: "Design & Build", desc: "I get to work and share progress along the way — you're never left wondering what's happening or waiting until the very end to see something." },
		{ title: "Deliver", desc: "You get the final files, source assets, and a short walkthrough — plus revisions if anything needs polishing before we call it done." },
	],

	// discipline: dev | design | video | ai
	projects: [
		{
			id: "kabugnaan-festival",
			title: "Kabankalan City Kabugnaan Festival",
			type: "Video Editing · Festival",
			discipline: "video",
			role: "Video editor",
			desc: "Checkout this video I created for the Kabankalan City Kabugnaan Festival — made as a dance group background video used for competition.",
			tags: ["Video Editing", "Festival", "Dance Background"],
			media: { kind: "drive", driveId: "1lLvv8GdqCIkWr5X4740_HCxiez1mMC2j" },
		},
		{
			id: "wolvyx",
			title: "Wolvyx Video Ads",
			type: "Video Ads · Client Work",
			discipline: "video",
			role: "Video producer & editor",
			desc: "High-converting video ad campaign for a premium men's apparel brand — showcasing their leak-proof boxer line across multiple product tiers.",
			tags: ["Video Production", "Ad Creative", "E-commerce"],
			media: { kind: "video", src: "projects/video/wolvyx.mp4", poster: "projects/video/posters/wolvyx.jpg" },
		},
		{
			id: "product-showcase",
			title: "Product Showcase & Ad Creative",
			type: "Graphic Design · Meta Ads",
			discipline: "design",
			role: "Graphic designer",
			desc: "Eye-catching Meta ad creatives and product showcases designed to stop the scroll and drive conversions for e-commerce brands.",
			tags: ["Meta Ads", "Product Showcase", "Performance Marketing"],
			media: { kind: "image", src: "projects/graphic/product showcase/2.png" },
			gallery: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => `projects/graphic/product showcase/${n}.png`),
			related: { label: "Browse all graphic design work", route: "media", filter: "graphic" },
		},
		{
			id: "youtube-assistance",
			title: "YouTube Content Assistance",
			type: "Video Editing · YouTube",
			discipline: "video",
			role: "Editor & content strategist",
			desc: "Full-service YouTube support — long-form edits, Shorts, scroll-stopping thumbnails, and content strategy aligned with current trends.",
			tags: ["Long Form", "Shorts & Reels", "Thumbnails", "Content Strategy"],
			media: { kind: "image", src: "projects/graphic/vsanimezone.png" },
			showChannels: true,
		},
		{
			id: "landing-pages",
			title: "Landing Pages & Web Apps",
			type: "Web Development · Full Stack",
			discipline: "dev",
			role: "Full stack developer",
			desc: "Clean, modern web solutions — from conversion-focused landing pages to full-featured applications built with Vue.js and Laravel.",
			tags: ["Vue.js", "Laravel", "MySQL", "JavaScript"],
			media: { kind: "image", src: "projects/landing-page/5.png" },
			gallery: [
				"projects/landing-page/1.png",
				"projects/landing-page/2.png",
				"projects/landing-page/3.png",
				"projects/landing-page/4.png",
				"projects/web_development_sessions/1.png",
				"projects/web_development_sessions/2.png",
				"projects/web_development_sessions/3.png",
			],
			links: [{ label: "GitHub profile", url: "https://github.com/jhop-xocdr" }],
		},
		{
			id: "ai-content",
			title: "AI-Powered Content Creation",
			type: "AI Services · Content Creation",
			discipline: "ai",
			role: "AI content creator",
			desc: "Leveraging AI tools to generate fast, on-brand content — from text-to-image visuals to image-to-video animations that scale creative output.",
			tags: ["Image to Video", "Text to Image", "Gemini", "ChatGPT"],
			media: { kind: "image", src: "projects/graphic/aicreations.png" },
			related: { label: "Watch the AI video collection", route: "media", filter: "ai-video" },
		},
	],

	mediaCategories: [
		{ id: "graphic", label: "Graphic Design" },
		{ id: "video", label: "Video" },
		{ id: "ai-video", label: "AI Video" },
		{ id: "reel", label: "Video Reel" },
	],

	// category: graphic | video | ai-video | reel. format groups items for the format chart.
	media: [
		// Graphic design
		{ category: "graphic", format: "Meta ad 1:1", type: "Meta Ads", title: "BOGO 50% Off", kind: "image", src: "projects/graphic/meta ads 1.1/bogo50.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Product Showcase", title: "Hydrotank Master — Dust Control", brand: "Hydrotank", kind: "image", src: "projects/graphic/meta ads 1.1/hydrotank master dust control anywhere.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Product Showcase", title: "Hydrotank", brand: "Hydrotank", kind: "image", src: "projects/graphic/meta ads 1.1/hydrotank.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Ecommerce", title: "Hoodie", kind: "image", src: "projects/graphic/meta ads 1.1/hoodie.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Ecommerce", title: "Lipstick", kind: "image", src: "projects/graphic/meta ads 1.1/lipstick.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Ecommerce", title: "Shoe", kind: "image", src: "projects/graphic/meta ads 1.1/shoe.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Ecommerce", title: "T-Shirt", kind: "image", src: "projects/graphic/meta ads 1.1/tshirt.png" },
		{ category: "graphic", format: "Meta ad 16:9", type: "Product Promo Ads", title: "Limited Offer", kind: "image", src: "projects/graphic/meta ads 16.9/limited offer.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Product Promo Ads", title: "Caviar", brand: "Caviar", kind: "image", src: "projects/graphic/meta ads 1.1/Caviar 1.1.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Product Promo Ads", title: "Crowntools Gang Gang", brand: "Crowntools", kind: "image", src: "projects/graphic/meta ads 1.1/Crowntools Gang Gang - 1x1.png" },
		{ category: "graphic", format: "Story 9:16", type: "Email Ads", title: "Caviar Story v1", brand: "Caviar", kind: "image", src: "projects/graphic/email/Caviar 9.16 v1.png" },
		{ category: "graphic", format: "Story 9:16", type: "Email Ads", title: "Caviar Story v2", brand: "Caviar", kind: "image", src: "projects/graphic/email/Caviar 9.16 v2.png" },
		{ category: "graphic", format: "Email", type: "Email Ads", title: "Crowntools Gang Gang Email", brand: "Crowntools", kind: "image", src: "projects/graphic/email/Crowntools Gang Gang.png" },
		{ category: "graphic", format: "Email", type: "Email Ads", title: "Caviar Premium Blade Email", brand: "Caviar", kind: "image", src: "projects/graphic/email/Email Design Caviar Premium Blade.png" },
		{ category: "graphic", format: "Email", type: "Email Ads", title: "Gang Gang Clips Email", brand: "Crowntools", kind: "image", src: "projects/graphic/email/Email Design Gang Gang Clips.png" },
		{ category: "graphic", format: "Meta ad 9:16", type: "Meta Ads", title: "Get Muldered", kind: "image", src: "projects/graphic/meta ads 9.16/get muldered.png" },
		{ category: "graphic", format: "Email", type: "Email Ads", title: "SquiJig Email", brand: "SquiJig", kind: "image", src: "projects/graphic/email/SquiJig email.png" },
		{ category: "graphic", format: "Email", type: "Email Ads", title: "Shakti House Email", brand: "Shakti House", kind: "image", src: "projects/graphic/email/Shakti House Email design v2.png" },
		{ category: "graphic", format: "Meta ad 1:1", type: "Meta Ads", title: "Shakti House", brand: "Shakti House", kind: "image", src: "projects/graphic/meta ads 1.1/Shakti House.png" },

		// Video
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Crowned Tools", brand: "Crowntools", kind: "video", src: "projects/video/Crowned Tools.mp4", poster: "projects/video/posters/crowned-tools.jpg" },
		{ category: "video", format: "UGC ad", type: "UGC Video Ads", title: "UGC Video Ad 1", kind: "drive", driveId: "1ZmNjwyY_ButqmE29TmufP0iTGizPisFJ" },
		{ category: "video", format: "UGC ad", type: "UGC Video Ads", title: "UGC Video Ad 2", kind: "drive", driveId: "1WfUcnc26gKICq3-4MC6Fohj9M8MXUgeN" },
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Caviar", brand: "Caviar", kind: "video", src: "projects/video/caviar (with bgm).mp4", poster: "projects/video/posters/caviar-with-bgm.jpg" },
		{ category: "video", format: "Tutorial", type: "Video Ads Tutorial", title: "Video Ads Tutorial", kind: "video", src: "projects/video/horizontal/h1.mp4", poster: "projects/video/posters/horizontal-h1.jpg" },
		{ category: "video", format: "Long form", type: "Long form video", title: "Long-form Video", kind: "video", src: "projects/video/horizontal/h2.mp4", poster: "projects/video/posters/horizontal-h2.jpg" },
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Video Ad — Horizontal 3", kind: "video", src: "projects/video/horizontal/h3.mp4", poster: "projects/video/posters/horizontal-h3.jpg" },
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Video Ad — Horizontal 4", kind: "video", src: "projects/video/horizontal/h4.mp4", poster: "projects/video/posters/horizontal-h4.jpg" },
		{ category: "video", format: "Shorts / Reels", type: "YT shorts/reels", title: "YT Shorts / Reels", kind: "video", src: "projects/video/horizontal/h5.mp4", poster: "projects/video/posters/horizontal-h5.jpg" },
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Video Ad — Horizontal 6", kind: "video", src: "projects/video/horizontal/h6.mp4", poster: "projects/video/posters/horizontal-h6.jpg" },
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Video Ad — Vertical 1", kind: "video", src: "projects/video/vertical/1.mp4", poster: "projects/video/posters/vertical-1.jpg" },
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Video Ad — Vertical 2", kind: "video", src: "projects/video/vertical/2.mp4", poster: "projects/video/posters/vertical-2.jpg" },
		{ category: "video", format: "Video ad", type: "Video Ads", title: "Video Ad — Vertical 3", kind: "video", src: "projects/video/vertical/3.mp4", poster: "projects/video/posters/vertical-3.jpg" },

		// AI video
		...[
			"1aasbrACVwqayZNpLw4E3PLOhJP-UJAqs",
			"14M5XHsTId7lHEZZ8oxw6Mrdv4pjYamYH",
			"1JZQYE0_nT7Ng55XZ2JR3i3zNq5GotbPe",
			"1-lcW7UDrpaUIZIeeQ1cmsHqcFm5-hxR1",
			"197OjiK7FmPS8yxnV5E0p6PP7zKNrrJxn",
			"1EJ7he0BpdK_1Nue7pb0dWt0L_lUHJNpR",
			"1nPUmjF15iQqn1uHnbsV9UZg7N9F-7FZL",
			"1QLASWXi3BHfCdZf11n9Mf9myuHxC_XN_",
		].map((driveId, i) => ({ category: "ai-video", format: "AI generated", type: "AI Generated Video", title: `AI Generated Video ${i + 1}`, kind: "drive", driveId })),

		// Video reel
		...[
			"15VijPuyj3nLbsvO5zRb_nGmPipz0Axvc",
			"1Q7vWWoQWclThJDYD6RCpS1NAg8ulaN3C",
			"1AKf92yLWZAED_sz_2qGAKEpT8faAa5tA",
			"1G-Ayxgt0mf6yEErlqCpE1Rj0qNBvVBxk",
			"1Gg2AoZH5OFRtVbh8E-e_9YaaXI34JONP",
			"1CD_OP9zUck8eH0ydMOR7nqf9hPoPjdOW",
			"132BUoykdwkilfKSzaSrPTRbCEZkjc-ze",
			"1hM2xOT41eRjzrJJ-9mFwiIozLQTZ7HJg",
			"1RN6BqxLsB1Fl4PZWM0I344_ye9utfyj5",
			"1fKQrXGrqtb89v6yw-IRQbsfwkebhVKi1",
		].map((driveId, i) => ({ category: "reel", format: "Reel", type: "Video Reel", title: `Reel ${String(i + 1).padStart(2, "0")}`, kind: "drive", driveId })),
	],
};
