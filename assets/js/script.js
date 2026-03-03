document.addEventListener("DOMContentLoaded", function () {
    var internalLinks = document.querySelectorAll('a[href^="#"]');
    var galleryImages = Array.prototype.slice.call(document.querySelectorAll(".project-media-item img"));
    var lightbox = document.getElementById("image-lightbox");
    var lightboxImage = document.getElementById("lightbox-image");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var closeButton = document.getElementById("lightbox-close");
    var prevButton = document.getElementById("lightbox-prev");
    var nextButton = document.getElementById("lightbox-next");
    var activeIndex = -1;

    function updateLightboxImage() {
        var selectedImage = galleryImages[activeIndex];
        if (!selectedImage) {
            return;
        }
        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;
        lightboxCaption.textContent = selectedImage.alt;
    }

    function openLightbox(index) {
        activeIndex = index;
        updateLightboxImage();
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        activeIndex = -1;
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

    closeButton.addEventListener("click", closeLightbox);
    nextButton.addEventListener("click", showNextImage);
    prevButton.addEventListener("click", showPrevImage);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("is-open")) {
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
});
