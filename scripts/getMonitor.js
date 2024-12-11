const fetchMonitors = async () => {
    const API_KEY = "ur2758122-7b4587990f5f71b80e24f679"; // It's read-only chumps

    try {
        const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ api_key: API_KEY }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Monitors:", data);

        const statush = document.getElementById("status");
        if (statush && data.monitors) {
            const statusText = data.monitors
                .map(
                    (monitor) =>
                        `Status: ${monitor.status === 2 ? "Up" : "Down"}\n`
                )
                .join("\n");
            statush.innerText = statusText;
        }
    } catch (error) {
        console.error("Error fetching monitors:", error);
        const statush = document.getElementById("status");
        if (statush) {
            statush.innerText = "Error fetching monitors. Please try again.";
        }
    }
};

window.onload = fetchMonitors;