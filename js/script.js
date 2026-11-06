(function () {
    var root = document.documentElement, lang = "no", t;

    function S(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function W(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

    function apply() {
        document.querySelectorAll("[data-no]").forEach(function (e) {
            e.textContent = e.getAttribute("data-" + lang);
        });
        document.querySelectorAll("[data-tip-no]").forEach(function (e) {
            var tip = e.getAttribute("data-tip-" + lang);
            if (tip) {
                e.setAttribute("data-tip", tip);
                e.setAttribute("title", tip);
            }
        });
        root.lang = lang;
        document.getElementById("lang").textContent = lang === "no" ? "EN" : "NO";
    }

    t = S("theme") || (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    root.setAttribute("data-theme", t);

    lang = S("lang") || "no";
    apply();

    document.getElementById("lang").onclick = function () {
        lang = lang === "no" ? "en" : "no";
        W("lang", lang);
        apply();
    };

    document.getElementById("theme").onclick = function () {
        t = t === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", t);
        W("theme", t);
    };

    /* Tech tabs */
    var bs = document.querySelectorAll("#tabs button"), ps = document.querySelectorAll(".panel");
    bs.forEach(function (b) {
        b.onclick = function () {
            var i = +b.getAttribute("data-t");
            bs.forEach(function (x, j) { x.classList.toggle("on", j === i); });
            ps.forEach(function (p, j) { p.hidden = j !== i; });
        };
    });

    /* Scroll reveal */
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }
})();