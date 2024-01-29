var promtpsDiv = document.querySelector(".prompts");

export function addDiv(name) {
    if (name == "alcoa") {
        promtpsDiv.innerHTML += alcoaText;
    }
    if (name == "elkjop") {
        promtpsDiv.innerHTML += elkjopText;
    }
}

export function deleteDiv() {
    promtpsDiv.innerHTML = "";
}

const alcoaText = `
<div class="textPrompt">
    <div class="textPrompt_title">
    <p>Alcoa Mosjøen</p>
    </div>
    <div class="textPrompt_subtitle">
    <p>Masonary group / Anode factory</p>
    </div>
    <div class="textPrompt_text">
    <p>At Alcoa Mosjøen I work as a substitute for 2 summers and 2 christmases</p>
    <p>
        The Masonry group at Alcoa's anode factory is responsible for the maintenance of the anode bakery ovens.
        Our work primarily involved constructing and demolishing large walls. This was hard manual labor and at times very hot.
        The assembly part of the wall was mainly handled by a robot.
        However, this robot proved to be unreliable and required extensive maintenance. This experience taught me the importance of
        designing a system that is easy to maintain.
    </p>
    </div>
    <div class="closebutton"> 
    <span id="closebutton">
        x
    </span>
    </div>
</div>
`;

const elkjopText = `
<div class="textPrompt">
    <div class="textPrompt_title">
        <p>Elkøp Mosjøen</p>
    </div>
    <div class="textPrompt_subtitle">
        <p>Sales Person / Major appliances</p>
    </div>
    <div class="textPrompt_text">
        <p>At Elkøp Mosjøen I work as part time worker for 1 and a half year.</p>
        <p>
        In my role in major appliance sales, I gained extensive knowledge about sales techniques and customer communication.
        I believe I excelled as a salesperson; however, my deeper passion lay in development.
        Consequently, I chose to pursue a Bachelor's degree in Computer Science instead of continuing a career in sales.
        </p>
    </div>
    <div class="closebutton"> 
        <span id="closebutton">
        x
        </span>
        </div>
    </div>
`;