document.addEventListener('DOMContentLoaded', function() {
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const headers = document.querySelectorAll('.header h1');
  headers.forEach(h => {
    const text = (h.textContent || '').trim();
    if (!text) return;
    const words = text.split(/\s+/);
    if (words.length < 3) return;
    const firstTwo = words.slice(0, 2).join(' ');
    const rest = words.slice(2).join(' ');
    // Preserve any existing child nodes if present by replacing textContent only
    h.innerHTML = escapeHtml(firstTwo) + ' <span class="hero-rest">' + escapeHtml(rest) + '</span>';
  });
});
