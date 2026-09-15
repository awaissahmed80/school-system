{{--
    Apply saved theme before paint.
    No cookie / "system" => follow OS. "light"|"dark" => explicit choice set after login.
--}}
<script>
    (function () {
        try {
            var match = document.cookie.match(/(?:^|; )appearance=([^;]*)/);
            var appearance = match ? decodeURIComponent(match[1]) : 'system';
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

            document.documentElement.classList.toggle('dark', isDark);
        } catch (e) {}
    })();
</script>
