document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector(".site-header");
    var navLinks = document.querySelectorAll('.navigation-list a[href^="#"]');
    var internalLinks = document.querySelectorAll('a[href^="#"]');
    var galleryImages = Array.prototype.slice.call(document.querySelectorAll(".project-media-item img"));
    var lightbox = document.getElementById("image-lightbox");
    var lightboxImage = document.getElementById("lightbox-image");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var closeButton = document.getElementById("lightbox-close");
    var prevButton = document.getElementById("lightbox-prev");
    var nextButton = document.getElementById("lightbox-next");
    var activeIndex = -1;
    var sectionIds = ["intro", "about", "projects", "engineering-notes", "tech-stack", "contact"];
    var sections = sectionIds
        .map(function (id) {
            return document.getElementById(id);
        })
        .filter(Boolean);

    function updateLightboxImage() {
        var selectedImage = galleryImages[activeIndex];
        if (!selectedImage || !lightboxImage) {
            return;
        }
        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;
        if (lightboxCaption) {
            lightboxCaption.textContent = selectedImage.alt;
        }
    }

    function openLightbox(index) {
        if (!lightbox) {
            return;
        }
        activeIndex = index;
        updateLightboxImage();
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!lightbox) {
            return;
        }
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        if (lightboxImage) {
            lightboxImage.src = "";
        }
        activeIndex = -1;
        document.body.style.overflow = "";
    }

    function showNextImage() {
        if (!galleryImages.length) {
            return;
        }
        activeIndex = (activeIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        if (!galleryImages.length) {
            return;
        }
        activeIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    internalLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            var targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }

            var targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            event.preventDefault();
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    galleryImages.forEach(function (image, index) {
        image.addEventListener("click", function () {
            openLightbox(index);
        });
    });

    if (closeButton) {
        closeButton.addEventListener("click", closeLightbox);
    }
    if (nextButton) {
        nextButton.addEventListener("click", showNextImage);
    }
    if (prevButton) {
        prevButton.addEventListener("click", showPrevImage);
    }

    if (lightbox) {
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (!lightbox || !lightbox.classList.contains("is-open")) {
            return;
        }
        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowRight") {
            showNextImage();
        } else if (event.key === "ArrowLeft") {
            showPrevImage();
        }
    });

    function onScroll() {
        if (header) {
            header.classList.toggle("is-scrolled", window.scrollY > 8);
        }

        if (!sections.length || !navLinks.length) {
            return;
        }

        var scrollPos = window.scrollY + 120;
        var currentId = sectionIds[0];

        sections.forEach(function (section, index) {
            if (section.offsetTop <= scrollPos) {
                currentId = sectionIds[index];
            }
        });

        navLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            var isActive = href === "#" + currentId;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length && "IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }
});
