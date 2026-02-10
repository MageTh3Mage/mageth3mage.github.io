document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;

    document.querySelector(".content").style.transform =
        `translate(${x}px, ${y}px)`;
});
