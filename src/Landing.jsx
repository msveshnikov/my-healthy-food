import { useEffect } from 'react';

export function Landing() {
    useEffect(() => {
        fetch('/template.html')
            .then((response) => response.text())
            .then((html) => {
                const container = document.getElementById('landing-container');
                container.innerHTML = html;
            });
    }, []);

    return <div id="landing-container"></div>;
}
